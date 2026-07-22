'use client';

import { useEffect, useRef, useState } from 'react';
import { WebSocketManager, WebSocketConfig } from '@/lib/websocket';

/**
 * Hook for managing WebSocket connections
 */
export function useWebSocket(
  url: string | null,
  config?: Partial<WebSocketConfig>
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocketManager | null>(null);

  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (!url) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const ws = new WebSocketManager({
      url,
      ...configRef.current,
      onMessage: (data) => {
        if (configRef.current?.onMessage) {
          configRef.current.onMessage(data);
        }
      },
      onError: (event) => {
        setError('WebSocket connection error');
        if (configRef.current?.onError) {
          configRef.current.onError(event);
        }
      },
      onClose: () => {
        setIsConnected(false);
        if (configRef.current?.onClose) {
          configRef.current.onClose();
        }
      },
    });

    wsRef.current = ws;

    ws.connect()
      .then(() => setIsConnected(true))
      .catch((err) => setError(err.message));

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url]);

  const send = (data: ArrayBuffer | string) => {
    if (wsRef.current) {
      wsRef.current.send(data);
    }
  };

  return {
    isConnected,
    error,
    send,
  };
}
