'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

export interface CallDetectorProps {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onRecordClick?: () => void;
}

export function CallDetector({ onCallStart, onCallEnd, onRecordClick }: CallDetectorProps) {
  const [isOnCall, setIsOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Monitor call state (simulate in hackathon)
    const checkCallState = async () => {
      // In real app, use Cordova or native bridge to detect calls
      // For hackathon, we'll provide manual record button
      // But simulate detecting audio input as proxy for "call"
    };

    const startAudioMonitoring = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyserRef.current = analyser;

        // Monitor audio levels (throttled to avoid React render depth limit)
        let lastUpdate = 0;
        const monitorAudio = () => {
          if (!analyserRef.current) return;

          const now = Date.now();
          if (now - lastUpdate > 120) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 255); // Normalize to 0-1
            lastUpdate = now;
          }

          requestAnimationFrame(monitorAudio);
        };

        monitorAudio();
      } catch (err) {
        console.log('[CallDetector] Audio permission not granted');
      }
    };

    startAudioMonitoring();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isOnCall) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOnCall]);

  const handleToggleRecord = () => {
    const nextState = !isRecording;
    setIsRecording(nextState);
    setIsOnCall(nextState);

    if (nextState) {
      onCallStart?.();
    } else {
      onCallEnd?.();
    }

    if (!onCallStart && !onCallEnd) {
      onRecordClick?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating audio level indicator */}
      {audioLevel > 0.1 && (
        <div className="absolute -top-12 right-0 flex items-center gap-2 bg-[hsl(220,14%,16%)] px-3 py-2 rounded-lg border border-[hsl(220,10%,25%)]">
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8].map((threshold, i) => (
              <div
                key={i}
                className="w-1 h-4 rounded transition-colors"
                style={{
                  backgroundColor:
                    audioLevel > threshold
                      ? audioLevel > 0.7
                        ? 'hsl(0, 100%, 50%)'
                        : 'hsl(40, 100%, 50%)'
                      : 'hsl(220, 10%, 25%)',
                }}
              />
            ))}
          </div>
          <span className="text-xs text-[hsl(0,0%,70%)]">{Math.round(audioLevel * 100)}%</span>
        </div>
      )}

      {/* Main record button */}
      <button
        onClick={handleToggleRecord}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full font-bold text-white transition-all transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-2xl ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_25px_rgba(239,68,68,0.75)] animate-pulse border-2 border-white'
            : 'bg-white text-black hover:bg-neutral-200 border-2 border-neutral-300 shadow-xl'
        }`}
        title={isRecording ? 'Stop Protective Session' : 'Start Protective Interdiction Session'}
      >
        {isRecording ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm mb-0.5 animate-ping" />
            <span className="text-[9px] font-mono font-extrabold tracking-tighter">STOP</span>
          </div>
        ) : (
          <Mic className="w-6 h-6 text-black mx-auto font-bold" />
        )}
      </button>

      {/* Call timer when recording */}
      {isRecording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[hsl(0,100%,50%)] text-white px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap">
          {formatTime(callDuration)}
        </div>
      )}
    </div>
  );
}
