'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface TrackStyle {
  id: string;
  color?: string;       // Custom color override (hex)
  hidden: boolean;      // If true, render at reduced opacity
  lineId?: string;      // Optional line assignment
  label?: string;       // Optional label/name
}

export interface TrackStyleData {
  version: number;
  lastModified: string;
  styles: Record<string, TrackStyle>;
}

interface TrackStyleContextType {
  styles: Record<string, TrackStyle>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTrackColor: (trackId: string, color: string | undefined) => void;
  setTrackHidden: (trackId: string, hidden: boolean) => void;
  setTrackLine: (trackId: string, lineId: string | undefined) => void;
  setTrackLabel: (trackId: string, label: string | undefined) => void;
  removeTrackStyle: (trackId: string) => void;
  clearAllStyles: () => void;
  
  // Bulk operations
  hideMultipleTracks: (trackIds: string[]) => void;
  colorMultipleTracks: (trackIds: string[], color: string) => void;
  
  // Persistence
  saveStyles: () => Promise<boolean>;
  loadStyles: () => Promise<void>;
  exportStyles: () => string;
  importStyles: (json: string) => boolean;
}

// ============================================================================
// UTILITY: Generate track ID from path
// ============================================================================

export function generateTrackId(path: { x: number; y: number; z: number }[]): string {
  const pathString = path
    .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)},${p.z.toFixed(1)}`)
    .join('|');
  
  let hash = 0;
  for (let i = 0; i < pathString.length; i++) {
    const char = pathString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `track_${Math.abs(hash).toString(16)}`;
}

// ============================================================================
// CONTEXT
// ============================================================================

const TrackStyleContext = createContext<TrackStyleContextType | null>(null);

export function useTrackStyles() {
  const context = useContext(TrackStyleContext);
  if (!context) {
    throw new Error('useTrackStyles must be used within a TrackStyleProvider');
  }
  return context;
}

// Optional hook that returns null if not in provider (for conditional use)
export function useTrackStylesOptional() {
  return useContext(TrackStyleContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

interface TrackStyleProviderProps {
  children: ReactNode;
  storageKey?: string;
  apiEndpoint?: string;
}

export function TrackStyleProvider({ 
  children, 
  storageKey = 'transit-map-track-styles',
  apiEndpoint = '/api/crn/track-styles'
}: TrackStyleProviderProps) {
  const [styles, setStyles] = useState<Record<string, TrackStyle>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStyles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Try API first
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const data: TrackStyleData = await response.json();
        setStyles(data.styles || {});
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn('API load failed, trying localStorage:', e);
    }
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data: TrackStyleData = JSON.parse(stored);
        setStyles(data.styles || {});
      }
    } catch (e) {
      console.error('Failed to load styles from localStorage:', e);
      setError('Failed to load track styles');
    }
    
    setIsLoading(false);
  }, [apiEndpoint, storageKey]);

  useEffect(() => {
    loadStyles();
  }, [loadStyles]);

  const saveStyles = useCallback(async (): Promise<boolean> => {
    const data: TrackStyleData = {
      version: 1,
      lastModified: new Date().toISOString(),
      styles,
    };
    
    // Save to localStorage as backup
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    
    // Try to save to API
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API save failed: ${response.status}`);
      }
      
      return true;
    } catch (e) {
      console.error('Failed to save to API:', e);
      setError('Saved locally only - API save failed');
      return false;
    }
  }, [styles, apiEndpoint, storageKey]);

  const setTrackColor = useCallback((trackId: string, color: string | undefined) => {
    setStyles(prev => {
      const existing = prev[trackId] || { id: trackId, hidden: false };
      if (color === undefined) {
        const { color: _, ...rest } = existing;
        return { ...prev, [trackId]: rest as TrackStyle };
      }
      return { ...prev, [trackId]: { ...existing, color } };
    });
  }, []);

  const setTrackHidden = useCallback((trackId: string, hidden: boolean) => {
    setStyles(prev => {
      const existing = prev[trackId] || { id: trackId, hidden: false };
      return { ...prev, [trackId]: { ...existing, hidden } };
    });
  }, []);

  const setTrackLine = useCallback((trackId: string, lineId: string | undefined) => {
    setStyles(prev => {
      const existing = prev[trackId] || { id: trackId, hidden: false };
      if (lineId === undefined) {
        const { lineId: _, ...rest } = existing;
        return { ...prev, [trackId]: rest as TrackStyle };
      }
      return { ...prev, [trackId]: { ...existing, lineId } };
    });
  }, []);

  const setTrackLabel = useCallback((trackId: string, label: string | undefined) => {
    setStyles(prev => {
      const existing = prev[trackId] || { id: trackId, hidden: false };
      if (label === undefined) {
        const { label: _, ...rest } = existing;
        return { ...prev, [trackId]: rest as TrackStyle };
      }
      return { ...prev, [trackId]: { ...existing, label } };
    });
  }, []);

  const removeTrackStyle = useCallback((trackId: string) => {
    setStyles(prev => {
      const { [trackId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllStyles = useCallback(() => {
    setStyles({});
  }, []);

  const hideMultipleTracks = useCallback((trackIds: string[]) => {
    setStyles(prev => {
      const updated = { ...prev };
      trackIds.forEach(id => {
        const existing = updated[id] || { id, hidden: false };
        updated[id] = { ...existing, hidden: true };
      });
      return updated;
    });
  }, []);

  const colorMultipleTracks = useCallback((trackIds: string[], color: string) => {
    setStyles(prev => {
      const updated = { ...prev };
      trackIds.forEach(id => {
        const existing = updated[id] || { id, hidden: false };
        updated[id] = { ...existing, color };
      });
      return updated;
    });
  }, []);

  const exportStyles = useCallback((): string => {
    const data: TrackStyleData = {
      version: 1,
      lastModified: new Date().toISOString(),
      styles,
    };
    return JSON.stringify(data, null, 2);
  }, [styles]);

  const importStyles = useCallback((json: string): boolean => {
    try {
      const data: TrackStyleData = JSON.parse(json);
      if (data.styles && typeof data.styles === 'object') {
        setStyles(data.styles);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import styles:', e);
      return false;
    }
  }, []);

  const value: TrackStyleContextType = {
    styles,
    isLoading,
    error,
    setTrackColor,
    setTrackHidden,
    setTrackLine,
    setTrackLabel,
    removeTrackStyle,
    clearAllStyles,
    hideMultipleTracks,
    colorMultipleTracks,
    saveStyles,
    loadStyles,
    exportStyles,
    importStyles,
  };

  return (
    <TrackStyleContext.Provider value={value}>
      {children}
    </TrackStyleContext.Provider>
  );
}