import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SavedContext = createContext(null);

export const SavedProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('haven_saved_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // When user logs in, sync user's savedProperties from database
  useEffect(() => {
    if (isAuthenticated && user?.savedProperties) {
      const ids = user.savedProperties.map(p => (typeof p === 'string' ? p : p._id));
      setSavedIds(ids);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    localStorage.setItem('haven_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = async (propertyId) => {
    const isAlreadySaved = savedIds.includes(propertyId);
    const newSaved = isAlreadySaved
      ? savedIds.filter(id => id !== propertyId)
      : [...savedIds, propertyId];

    setSavedIds(newSaved);

    // Sync to backend if logged in
    if (isAuthenticated) {
      try {
        await api.post('/user/saved', { propertyId });
      } catch (err) {
        console.warn('Failed to sync saved property to backend:', err.message);
      }
    }
  };

  const isSaved = (propertyId) => savedIds.includes(propertyId);

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave, isSaved, count: savedIds.length }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
