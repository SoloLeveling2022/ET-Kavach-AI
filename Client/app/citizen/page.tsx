'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SessionHeader } from '@/components/SessionHeader';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ThreatGauge } from '@/components/ThreatGauge';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { LivenessMonitor } from '@/components/LivenessMonitor';
import { CallDetector } from '@/components/CallDetector';
import { PermissionsRequest } from '@/components/PermissionsRequest';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useThreatPolling } from '@/hooks/useThreatPolling';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useSession } from '@/context/SessionContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useGyroSensor } from '@/hooks/useGyroSensor';
import { mockGenerateAudioFrame } from '@/lib/mock-api';
import { ProtectedRoute } from '@/context/AuthContext';
import { ShieldCheck, PhoneCall, Radio, AlertTriangle } from 'lucide-react';

export default function CitizenPage() {
  const { sessionId, wsAudioUrl, wsSensorUrl, threatIndex } = useSession();
  const [audioData, setAudioData] = useState<ArrayBuffer | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(isRecording);
  const audioDataRef = useRef<ArrayBuffer>();
  const audioGeneratorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const wsConfig = React.useMemo(() => ({ binaryType: 'arraybuffer' as const }), []);

  const getWsUrl = React.useCallback((urlPath: string | null) => {
    if (!urlPath || (sessionId && sessionId.startsWith('sess_'))) return null;
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//127.0.0.1:8080${urlPath}`;
  }, [sessionId]);

  const audioUrl = React.useMemo(() => getWsUrl(wsAudioUrl), [getWsUrl, wsAudioUrl]);
  const sensorUrl = React.useMemo(() => getWsUrl(wsSensorUrl), [getWsUrl, wsSensorUrl]);

  const { send: sendAudio } = useWebSocket(audioUrl, wsConfig);
  const { send: sendSensor } = useWebSocket(sensorUrl, wsConfig);

  useThreatPolling();

  const lastAudioUpdateRef = useRef(0);
  const { startAudio, hasAudio } = useMediaStream({
    onAudioFrame: (data) => {
      audioDataRef.current = data;
      const now = Date.now();
      if (now - lastAudioUpdateRef.current > 200) {
        setAudioData(data);
        lastAudioUpdateRef.current = now;
      }
      if (isRecordingRef.current) sendAudio(data);
    },
  });

  const { start: startGyro, stop: stopGyro } = useGyroSensor({
    onData: (data) => {
      if (isRecordingRef.current) {
        sendSensor(JSON.stringify({ gx: data.gx, gy: data.gy, gz: data.gz, ts: data.timestamp }));
      }
    },
  });

  useEffect(() => {
    if (sessionId) {
      startAudio().catch((err) => console.log('[Citizen] Audio init deferred:', err));
    }
  }, [sessionId, startAudio]);

  useEffect(() => {
    if (isRecording) startGyro().catch(() => {});
    else stopGyro();
    return () => stopGyro();
  }, [isRecording, startGyro, stopGyro]);

  useEffect(() => {
    if (isRecording && !hasAudio) {
      audioGeneratorRef.current = setInterval(() => {
        const audioFrame = mockGenerateAudioFrame(threatIndex);
        const buffer = new ArrayBuffer(audioFrame.length * 2);
        const view = new Int16Array(buffer);
        for (let i = 0; i < audioFrame.length; i++) {
          view[i] = Math.max(-32768, Math.min(32767, audioFrame[i] * 32767));
        }
        setAudioData(buffer);
        sendAudio(buffer);
      }, 100);
    } else if (audioGeneratorRef.current) {
      clearInterval(audioGeneratorRef.current);
    }
    return () => {
      if (audioGeneratorRef.current) clearInterval(audioGeneratorRef.current);
    };
  }, [isRecording, hasAudio, threatIndex, sendAudio]);

  return (
    <ProtectedRoute>
      <div className="w-full h-screen max-h-screen overflow-hidden bg-black text-white font-sans flex flex-col">
        <DashboardLayout
          header={<SessionHeader />}
          threatGauge={<ThreatGauge />}
          audioVisualizer={<AudioVisualizer audioData={audioData} />}
          liveness={<LivenessMonitor persona="citizen" />}
          moneyFlow={null}
          gisMap={null}
          forensicDocket={null}
          persona="citizen"
        />

        <CallDetector
          onCallStart={() => setIsRecording(true)}
          onCallEnd={() => setIsRecording(false)}
        />
        <PermissionsRequest />
        <InstallPrompt />
      </div>
    </ProtectedRoute>
  );
}
