'use client';

import { useEffect, useRef, useState } from 'react';
import { SENSOR_CONFIG } from '@/lib/constants';

interface GyroData {
  gx: number;
  gy: number;
  gz: number;
  timestamp: number;
}

interface UseGyroSensorOptions {
  onData?: (data: GyroData) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for accessing device gyroscope sensor
 */
export function useGyroSensor(options?: UseGyroSensorOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'pending'>('pending');

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const listenerRef = useRef<((event: DeviceMotionEvent) => void) | null>(null);

  // Request permission for iOS 13+
  const requestPermission = async (): Promise<boolean> => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setIsSupported(false);
      return false;
    }

    // Check if permission is needed (iOS 13+)
    if ((DeviceMotionEvent as any).requestPermission) {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionStatus('granted');
          setIsSupported(true);
          return true;
        } else {
          setPermissionStatus('denied');
          setError('Gyroscope permission denied');
          return false;
        }
      } catch (err) {
        console.error('[useGyroSensor] Permission request failed:', err);
        setError('Failed to request gyroscope permission');
        return false;
      }
    }

    // Android and other platforms don't require explicit permission
    setIsSupported(true);
    setPermissionStatus('granted');
    return true;
  };

  // Start listening to gyroscope
  const start = async () => {
    if (!isSupported && !await requestPermission()) {
      const errorMsg = 'Gyroscope not supported or permission denied';
      setError(errorMsg);
      if (optionsRef.current?.onError) {
        optionsRef.current.onError(errorMsg);
      }
      return;
    }

    listenerRef.current = (event: DeviceMotionEvent) => {
      if (!event.rotationRate) return;

      const data: GyroData = {
        gx: event.rotationRate.alpha || 0,
        gy: event.rotationRate.beta || 0,
        gz: event.rotationRate.gamma || 0,
        timestamp: Date.now(),
      };

      if (optionsRef.current?.onData) {
        optionsRef.current.onData(data);
      }
    };

    window.addEventListener('devicemotion', listenerRef.current);
    setIsActive(true);
    setError(null);
  };

  // Stop listening
  const stop = () => {
    if (listenerRef.current) {
      window.removeEventListener('devicemotion', listenerRef.current);
      listenerRef.current = null;
    }
    setIsActive(false);
  };

  // Check support on mount
  useEffect(() => {
    const hasSupport = typeof window !== 'undefined' && typeof DeviceMotionEvent !== 'undefined';
    setIsSupported(hasSupport);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isSupported,
    isActive,
    permissionStatus,
    error,
    requestPermission,
    start,
    stop,
  };
}
