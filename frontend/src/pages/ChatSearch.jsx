import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  X,
  MapPin,
  IndianRupee,
  Bed,
  Building,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  Info,
  Terminal,
  Cpu
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function ChatSearch() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('haven_session_id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedPreferences, setExtractedPreferences] = useState({});
  const [clarificationPrompt, setClarificationPrompt] = useState(null);
  const [engineMode, setEngineMode] = useState('Deterministic NLP');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('haven_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    async function initChat() {
      try {
        const res = await api.get(`/ai/conversation/${sessionId}`);
        if (res.success && res.conversation && res.conversation.messages?.length > 0) {
          setMessages(res.conversation.messages);
          if (res.conversation.extractedPreferences) {
            setExtractedPreferences(res.conversation.extractedPreferences);
          }
        } else {
          const welcomeMsg = {
            sender: 'haven',
            text: "Welcome to HAVEN AI. I am your specialized Hyderabad real estate intelligence advisor. Tell me what you're looking for — for example: locality (HITEC City, Gachibowli, Kondapur), target budget in Lakhs or Crores, BHK layout, or nearby facilities like metro stations and schools.",
            recommendedProperties: [],
            timestamp: new Date()
          };
          setMessages([welcomeMsg]);

          if (initialQuery) {
            sendUserMessage(initialQuery);
          }
        }
      } catch (err) {
        console.warn('Could not load existing session:', err.message);
      }
    }
    initChat();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendUserMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        sessionId,
        message: text.trim()
      });

      if (res.success) {
        setExtractedPreferences(res.extractedPreferences || {});
        setClarificationPrompt(res.clarificationPrompt || null);
        if (res.engineMode) setEngineMode(res.engineMode);

        const havenMessage = {
          sender: 'haven',
          text: res.reply,
          recommendations: res.recommendations || [],
          isAlternative: res.isAlternative,
          alternativeNote: res.alternativeNote,
          clarificationPrompt: res.clarificationPrompt,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, havenMessage]);
      }
    } catch (err) {
      const errorMsg = {
        sender: 'haven',
        text: `I encountered an issue processing your request: ${err.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendUserMessage();
  };

  const handleRemovePreference = async (key, valToRemove = null) => {
    const updated = { ...extractedPreferences };

    if (valToRemove && Array.isArray(updated[key])) {
      updated[key] = updated[key].filter(v => v !== valToRemove);
      if (updated[key].length === 0) delete updated[key];
    } else {
      delete updated[key];
    }

    setExtractedPreferences(updated);

    try {
      const res = await api.put(`/ai/conversation/${sessionId}/preferences`, {
        preferences: updated
      });
      if (res.success) {
        const updateMsg = {
          sender: 'haven',
          text: `Preferences adjusted. Recalculated ${res.recommendations?.length || 0} matching properties.`,
          recommendations: res.recommendations || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, updateMsg]);
      }
    } catch (err) {
      console.warn('Failed to update preference:', err.message);
    }
  };

  const handleResetSession = async () => {
    if (!window.confirm('Reset this conversation session and clear preferences?')) return;
    try {
      await api.delete(`/ai/conversation/${sessionId}`);
    } catch (err) {
      console.warn('Reset error:', err.message);
    }
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSession);
    setExtractedPreferences({});
    setClarificationPrompt(null);
    setMessages([
      {
        sender: 'haven',
        text: "Session cleared. What kind of home are you searching for in Hyderabad?",
        timestamp: new Date()
      }
    ]);
  };

  const samplePrompts = [
    "Show me apartments in Gachibowli under ₹70 lakhs.",
    "Yes, and it should be near metro stations.",
    "2BHK in HITEC City with swimming pool under ₹60L",
    "Independent villa in Gachibowli with private garden"
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-dark-950 flex flex-col relative overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Session Bar */}
      <div className="bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm sm:text-base text-white">
                Conversational AI Property Console
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {engineMode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Natural language preference parsing & multi-factor relevance ranking
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSession}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 rounded-xl transition-all"
          title="Start new conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>

      {/* Main Chat & Sidebar Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        
        {/* Left/Center Chat Timeline (Span 3 on desktop) */}
        <div className="lg:col-span-3 flex flex-col bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark overflow-hidden h-[75vh]">
          
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] flex-shrink-0 mt-1 shadow-glow-cyan">
                      <div className="w-full h-full bg-dark-900 rounded-xl flex items-center justify-center">
                        <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[78%] space-y-3`}>
                    {/* Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-700/80 via-indigo-700/80 to-purple-800/80 text-white rounded-tr-none border border-purple-400/30 shadow-glow-purple'
                          : 'bg-dark-950/80 text-slate-200 border border-white/10 rounded-tl-none shadow-md backdrop-blur-md'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {msg.clarificationPrompt && (
                        <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-start gap-2 text-cyan-200 font-semibold text-xs bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20">
                          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{msg.clarificationPrompt}</span>
                        </div>
                      )}
                    </div>

                    {/* Embedded Matching Properties */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                          <span className="flex items-center gap-1.5 text-cyan-300">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            {msg.isAlternative
                              ? 'Suggested Alternatives:'
                              : `Recommended Properties (${msg.recommendations.length}):`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {msg.recommendations.map((property) => (
                            <PropertyCard
                              key={property._id}
                              property={property}
                              showScore={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 px-1 block font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-glow-purple mt-1">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-dark-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="bg-dark-950/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-300 text-xs flex items-center gap-2.5 shadow-glow-cyan">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>HAVEN is evaluating database listings against your criteria...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestions chips */}
          <div className="px-4 py-2.5 bg-dark-950/70 border-t border-white/[0.06] flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              Quick Prompts:
            </span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendUserMessage(prompt)}
                className="text-xs px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/30 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-dark-950 border-t border-white/[0.08] flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell HAVEN your requirements (e.g. '3BHK in Kondapur under 75L near metro')"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-dark-900 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan text-xs sm:text-sm transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-dark-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-glow-cyan disabled:opacity-40 transition-all flex-shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4 text-dark-950" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: Extracted Requirements Inspector HUD */}
        <div className="bg-dark-900/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-card-dark p-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/[0.08] pb-3.5">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Extracted Requirements</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Real-time active constraints extracted from your conversation.
              </p>
            </div>

            {/* Criteria Cards */}
            <div className="space-y-4 text-xs">
              
              {/* Locality */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Target Locality
                </span>
                {extractedPreferences.locality ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{extractedPreferences.locality}</span>
                    <button
                      onClick={() => handleRemovePreference('locality')}
                      className="ml-1 text-cyan-400/60 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">Any locality</span>
                )}
              </div>

              {/* Budget */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Max Budget
                </span>
                {extractedPreferences.maxBudget ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {extractedPreferences.maxBudget >= 10000000
                        ? `Under ₹${(extractedPreferences.maxBudget / 10000000).toFixed(2)} Cr`
                        : `Under ₹${(extractedPreferences.maxBudget / 100000).toFixed(0)} Lakhs`}
                    </span>
                    <button
                      onClick={() => handleRemovePreference('maxBudget')}
                      className="ml-1 text-emerald-400/60 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">No budget cap</span>
                )}
              </div>

              {/* BHK */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Bedrooms (BHK)
                </span>
                {extractedPreferences.bhk && extractedPreferences.bhk.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {extractedPreferences.bhk.map((bhkNum) => (
                      <span
                        key={bhkNum}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold"
                      >
                        <Bed className="w-3.5 h-3.5 text-purple-400" />
                        <span>{bhkNum} BHK</span>
                        <button
                          onClick={() => handleRemovePreference('bhk', bhkNum)}
                          className="text-purple-400/60 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">Any BHK</span>
                )}
              </div>

              {/* Gated Community */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Gated Community
                </span>
                {extractedPreferences.isGatedCommunity !== undefined &&
                extractedPreferences.isGatedCommunity !== null ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Gated Society Required</span>
                    <button
                      onClick={() => handleRemovePreference('isGatedCommunity')}
                      className="text-teal-400/60 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">Not specified</span>
                )}
              </div>

              {/* Amenities */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Requested Amenities
                </span>
                {extractedPreferences.amenities && extractedPreferences.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {extractedPreferences.amenities.map((am) => (
                      <span
                        key={am}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-dark-950 text-slate-300 border border-white/10 text-[11px] font-medium"
                      >
                        <span>{am}</span>
                        <button
                          onClick={() => handleRemovePreference('amenities', am)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">None specified</span>
                )}
              </div>

              {/* Nearby Facilities */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  Nearby Facilities
                </span>
                {extractedPreferences.nearbyFacilities &&
                extractedPreferences.nearbyFacilities.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {extractedPreferences.nearbyFacilities.map((fac) => (
                      <span
                        key={fac}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium"
                      >
                        <span>{fac}</span>
                        <button
                          onClick={() => handleRemovePreference('nearbyFacilities', fac)}
                          className="text-cyan-400/60 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-[11px]">None specified</span>
                )}
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] mt-6">
            <Link
              to="/properties"
              className="w-full py-2.5 px-3 rounded-xl bg-dark-950 hover:bg-dark-850 text-slate-300 hover:text-white border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore All Listings in Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
