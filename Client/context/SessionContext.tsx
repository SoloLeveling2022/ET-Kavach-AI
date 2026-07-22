'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SessionContextType } from '@/lib/types';
import { initializeSession, closeSession } from '@/lib/api';

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [wsAudioUrl, setWsAudioUrl] = useState<string | null>(null);
  const [wsSensorUrl, setWsSensorUrl] = useState<string | null>(null);
  const [threatIndex, setThreatIndex] = useState(0);
  const [agentScores, setAgentScores] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await initializeSession();
      console.log('[SessionContext] Session initialized:', response.session_id);
      setSessionId(response.session_id);
      setWsAudioUrl(response.ws_audio_url);
      setWsSensorUrl(response.ws_sensor_url);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[SessionContext] Init failed:', message);
      setError(message);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeSessionFn = useCallback(async () => {
    if (sessionId) {
      try {
        await closeSession(sessionId);
        console.log('[SessionContext] Session closed');
        setSessionId(null);
        setWsAudioUrl(null);
        setWsSensorUrl(null);
        setIsInitialized(false);
      } catch (err) {
        console.error('[SessionContext] Close failed:', err);
      }
    }
  }, [sessionId]);

  // Initialize on mount
  useEffect(() => {
    initSession();

    // Cleanup on unmount
    return () => {
      closeSessionFn();
    };
  }, [initSession]);

  const value: SessionContextType = {
    sessionId,
    wsAudioUrl,
    wsSensorUrl,
    threatIndex,
    agentScores,
    isInitialized,
    error,
    isLoading,
    initSession,
    closeSession: closeSessionFn,
  };

  // Provide utility functions to update state
  const contextValue = useMemo(
    () => ({
      ...value,
      _setThreatIndex: setThreatIndex,
      _setAgentScores: setAgentScores,
    }),
    [value]
  );

  return (
    <SessionContext.Provider value={contextValue as any}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}

/**
 * Hook to update threat data in context
 */
export function useUpdateThreat() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useUpdateThreat must be used within SessionProvider');
  }

  return useCallback((threatIndex: number, agentScores: any) => {
    (context as any)._setThreatIndex(threatIndex);
    (context as any)._setAgentScores(agentScores);
  }, [context._setThreatIndex, context._setAgentScores]);
}
