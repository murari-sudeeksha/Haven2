import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import { CompareProvider } from './context/CompareContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import ChatSearch from './pages/ChatSearch';
import SearchListings from './pages/SearchListings';
import PropertyDetails from './pages/PropertyDetails';
import Compare from './pages/Compare';
import Insights from './pages/Insights';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <CompareProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-dark-950 text-slate-100 font-sans selection:bg-cyan-400 selection:text-dark-950">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/chat" element={<ChatSearch />} />
                  <Route path="/properties" element={<SearchListings />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected User Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </CompareProvider>
      </SavedProvider>
    </AuthProvider>
  );
}
