import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [comparedProperties, setComparedProperties] = useState(() => {
    try {
      const stored = localStorage.getItem('haven_compared_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('haven_compared_properties', JSON.stringify(comparedProperties));
  }, [comparedProperties]);

  const toggleCompare = (property) => {
    const exists = comparedProperties.some(p => p._id === property._id);
    if (exists) {
      setComparedProperties(prev => prev.filter(p => p._id !== property._id));
      return { success: true, action: 'removed' };
    } else {
      if (comparedProperties.length >= 4) {
        return {
          success: false,
          action: 'limit_reached',
          message: 'You can compare up to 4 properties at a time.'
        };
      }
      setComparedProperties(prev => [...prev, property]);
      return { success: true, action: 'added' };
    }
  };

  const removeFromCompare = (propertyId) => {
    setComparedProperties(prev => prev.filter(p => p._id !== propertyId));
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  const isCompared = (propertyId) => {
    return comparedProperties.some(p => p._id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProperties,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        count: comparedProperties.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
