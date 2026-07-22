'use client';

import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { getThreat } from '@/lib/api';
import { POLLING } from '@/lib/constants';
import { useSession, useUpdateThreat } from '@/context/SessionContext';

/**
 * Hook to poll threat data at regular intervals
 */
export function useThreatPolling() {
  const { sessionId } = useSession();
  const updateThreat = useUpdateThreat();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateThreatRef = useRef(updateThreat);

  useEffect(() => {
    updateThreatRef.current = updateThreat;
  }, [updateThreat]);

  // Fetch threat data with SWR automatic refresh interval
  const { data, error, isLoading } = useSWR(
    sessionId ? ['threat', sessionId] : null,
    () => (sessionId ? getThreat(sessionId) : null),
    {
      refreshInterval: POLLING.THREAT_INTERVAL,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Update context when data changes
  useEffect(() => {
    if (data) {
      updateThreatRef.current(data.threat_index, data.agent_scores);
    }
  }, [data]);

  return {
    data,
    error,
    isLoading,
  };
}
