'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AUDIO_CONFIG, VIRTUAL_CAMERA_BLOCKLIST, ERROR_MESSAGES } from '@/lib/constants';
import { encodeAudioFrame } from '@/lib/audio';

interface UseMediaStreamOptions {
  onAudioFrame?: (data: ArrayBuffer) => void;
  onError?: (error: string) => void;
  onCameraBlocked?: () => void;
}

/**
 * Hook for capturing audio and video streams
 */
export function useMediaStream(options?: UseMediaStreamOptions) {
  const [hasAudio, setHasAudio] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optionsRef = useRef(options);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Check for virtual camera
  const checkDeviceAuthenticity = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      for (const device of devices) {
        const label = device.label.toLowerCase();
        for (const blocklist of VIRTUAL_CAMERA_BLOCKLIST) {
          if (label.includes(blocklist.toLowerCase())) {
            console.warn('[useMediaStream] Virtual camera detected:', device.label);
            setIsBlocked(true);
            if (optionsRef.current?.onCameraBlocked) {
              optionsRef.current.onCameraBlocked();
            }
            setError(ERROR_MESSAGES.VIRTUAL_CAMERA_DETECTED);
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.warn('[useMediaStream] Device enumeration failed:', err);
      return true; // Assume authentic if we can't check
    }
  }, []);

  // Start audio capture
  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: AUDIO_CONFIG.SAMPLE_RATE },
          channelCount: { ideal: AUDIO_CONFIG.CHANNELS },
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      setHasAudio(true);
      setError(null);

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Set audio context sample rate to 16kHz
      const source = audioContext.createMediaStreamSource(stream);

      // Create script processor for raw audio
      const processor = audioContext.createScriptProcessor(
        AUDIO_CONFIG.CHUNK_SIZE,
        AUDIO_CONFIG.CHANNELS,
        AUDIO_CONFIG.CHANNELS
      );

      processor.onaudioprocess = (event: AudioProcessingEvent) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const pcmData = encodeAudioFrame(inputData);

        if (optionsRef.current?.onAudioFrame) {
          optionsRef.current.onAudioFrame(pcmData);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      processorRef.current = processor;
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.DEVICE_PERMISSION_DENIED;
      console.error('[useMediaStream] Audio capture failed:', message);
      setError(message);
      if (optionsRef.current?.onError) {
        optionsRef.current.onError(message);
      }
    }
  }, []);

  // Start camera capture
  const startCamera = useCallback(async (): Promise<MediaStream | null> => {
    try {
      // Check device authenticity first
      const isAuthentic = await checkDeviceAuthenticity();
      if (!isAuthentic) {
        return null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      setHasCamera(true);
      setError(null);
      return stream;
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.DEVICE_PERMISSION_DENIED;
      console.error('[useMediaStream] Camera capture failed:', message);
      setError(message);
      if (optionsRef.current?.onError) {
        optionsRef.current.onError(message);
      }
      return null;
    }
  }, [checkDeviceAuthenticity]);

  // Stop all streams
  const stop = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setHasAudio(false);
    setHasCamera(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    hasAudio,
    hasCamera,
    isBlocked,
    error,
    startAudio,
    startCamera,
    stop,
  };
}
