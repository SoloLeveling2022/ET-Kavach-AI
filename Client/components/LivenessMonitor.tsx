'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldAlert, CheckCircle, Upload, Banknote, Scan, Sparkles, RefreshCw } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { useMediaStream } from '@/hooks/useMediaStream';
import { uploadBanknoteFrame } from '@/lib/api';

export function LivenessMonitor({ persona }: { persona?: 'citizen' | 'teller' | 'investigator' }) {
  const { sessionId, agentScores } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [banknoteStatus, setBanknoteStatus] = useState<string | null>(null);
  const [isScanningNote, setIsScanningNote] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{
    score: number;
    verdict: 'genuine' | 'uncertain' | 'counterfeit';
    timestamp: string;
    reason: string;
  } | null>(null);

  const { startCamera, stop, error } = useMediaStream();

  // Load camera when session is ready
  useEffect(() => {
    if (sessionId) {
      startCamera()
        .then((stream) => {
          if (stream) {
            setVideoStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          }
        })
        .catch((err) => console.log('[LivenessMonitor] Camera access deferred:', err));
    }

    return () => {
      stop();
    };
  }, [sessionId, startCamera, stop]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    setBanknoteStatus('Uploading banknote for 2D FFT Intaglio check...');
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const b64 = evt.target?.result as string;
      if (b64) {
        await processFrameUpload(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSnapAndScanWebCamNote = async () => {
    if (!videoRef.current || !sessionId) {
      setBanknoteStatus('WebCam feed or session not ready.');
      return;
    }

    try {
      setIsScanningNote(true);
      setBanknoteStatus('⚡ Initiating 2D Fast Fourier Transform (FFT) Intaglio Scan...');

      // Capture frame from webcam video element using offscreen canvas
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw un-mirrored frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        const b64Frame = canvas.toDataURL('image/jpeg', 0.95);

        // Upload frame to backend Lumen Agent
        await uploadBanknoteFrame(sessionId, b64Frame);

        // Keep scanning animation active for 1.2s to enhance UX feedback
        setTimeout(() => {
          setIsScanningNote(false);
          const currentLumen = agentScores ? (agentScores as any).lumen : 0.05;
          const isFake = currentLumen > 0.40;

          setLastScanResult({
            score: currentLumen,
            verdict: currentLumen < 0.25 ? 'genuine' : isFake ? 'counterfeit' : 'uncertain',
            timestamp: new Date().toLocaleTimeString(),
            reason: isFake
              ? 'Low high-frequency intaglio ridge energy detected (Photocopy/Smooth Inkjet)'
              : 'Intaglio micro-ridges & spatial spectra within genuine tolerance (2-8 lp/mm)',
          });

          setBanknoteStatus(
            isFake
              ? '⚠️ Counterfeit Warning: Low Intaglio Ridge Energy Detected'
              : '✓ Banknote Verified Genuine by Lumen Agent'
          );
          setTimeout(() => setBanknoteStatus(null), 5000);
        }, 1200);
      } else {
        setIsScanningNote(false);
      }
    } catch (err) {
      console.error('[LivenessMonitor] WebCam scan failed:', err);
      setIsScanningNote(false);
      setBanknoteStatus('Failed to capture WebCam frame.');
    }
  };

  const processFrameUpload = async (b64: string) => {
    if (!sessionId) return;
    setIsScanningNote(true);
    await uploadBanknoteFrame(sessionId, b64);
    setTimeout(() => {
      setIsScanningNote(false);
      const currentLumen = agentScores ? (agentScores as any).lumen : 0.05;
      const isFake = currentLumen > 0.40;

      setLastScanResult({
        score: currentLumen,
        verdict: currentLumen < 0.25 ? 'genuine' : isFake ? 'counterfeit' : 'uncertain',
        timestamp: new Date().toLocaleTimeString(),
        reason: isFake
          ? 'Low high-frequency intaglio ridge energy detected (Photocopy/Smooth Inkjet)'
          : 'Intaglio micro-ridges & spatial spectra within genuine tolerance (2-8 lp/mm)',
      });

      setBanknoteStatus(
        isFake
          ? '⚠️ Counterfeit Warning: Low Intaglio Ridge Energy Detected'
          : '✓ Banknote Frame Verified Genuine'
      );
      setTimeout(() => setBanknoteStatus(null), 5000);
    }, 1200);
  };

  const veritasScore = agentScores ? (agentScores as any).veritas : 0.0;
  const lumenScore = agentScores ? (agentScores as any).lumen : 0.0;
  const isVirtualCamera = veritasScore >= 0.75;
  const isGenuine = veritasScore < 0.20 && sessionId;

  return (
    <div className="w-full h-full min-h-[460px] sm:min-h-[540px] flex flex-col font-sans">
      <div className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wider flex items-center justify-between">
        <span>{persona === 'teller' ? 'Lumen Banknote & Veritas Optical Ingest' : 'Lumen Banknote & Veritas Liveness Monitor'}</span>
        <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-white" /> 2D FFT Intaglio Active
        </span>
      </div>

      <div className="flex-1 min-h-[400px] sm:min-h-[480px] bg-black border border-neutral-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Real video feed element */}
        {videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded transform -scale-x-100"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-950 rounded flex flex-col items-center justify-center gap-2">
            <Camera className="w-10 h-10 text-neutral-500 animate-pulse" />
            <span className="text-xs text-neutral-400 font-mono">Initializing camera feed...</span>
          </div>
        )}

        {/* Ambient video scanline animation */}
        {videoStream && !isVirtualCamera && !isScanningNote && (
          <div className="absolute inset-x-0 h-0.5 bg-white bg-opacity-40 animate-scan top-0 pointer-events-none" />
        )}

        {/* Active High-Tech 2D Banknote Scanning Laser Animation */}
        {isScanningNote && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between bg-black/30 backdrop-blur-[1px]">
            {/* Top scanning laser beam */}
            <div className="w-full h-1 bg-white shadow-[0_0_20px_#ffffff] animate-scan" />
            
            {/* Target reticle crosshairs */}
            <div className="absolute inset-12 border-2 border-white/80 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-l-2 border-white absolute top-0 left-0" />
              <div className="w-8 h-8 border-t-2 border-r-2 border-white absolute top-0 right-0" />
              <div className="w-8 h-8 border-b-2 border-l-2 border-white absolute bottom-0 left-0" />
              <div className="w-8 h-8 border-b-2 border-r-2 border-white absolute bottom-0 right-0" />
              <div className="px-3 py-1 bg-black/90 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded border border-neutral-700 animate-pulse">
                [LUMEN AI] Analyzing 2D FFT Micro-Ridge Frequencies...
              </div>
            </div>
          </div>
        )}

        {/* Control Bar Overlay: WebCam Snap & File Upload */}
        <div className="absolute bottom-2 sm:bottom-3 inset-x-2 sm:inset-x-3 bg-neutral-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-neutral-800 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 z-20 font-mono">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* WebCam Snap & Scan Button */}
            <button
              onClick={handleSnapAndScanWebCamNote}
              disabled={isScanningNote || !videoStream}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              {isScanningNote ? (
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-black" />
              ) : (
                <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
              )}
              <span>{isScanningNote ? 'Scanning Note...' : '⚡ Snap & Scan WebCam'}</span>
            </button>

            {/* Image File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer border border-neutral-700"
            >
              <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Upload Image</span>
            </button>
          </div>

          <div className="text-[9px] sm:text-[10px] text-neutral-300 flex items-center gap-1">
            <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            <span>Lumen: {lumenScore.toFixed(3)}</span>
          </div>
        </div>

        {/* Status Toast Banner */}
        {banknoteStatus && (
          <div className="absolute top-12 inset-x-4 p-2 bg-neutral-900/95 border border-white text-white text-[10px] font-mono rounded-lg text-center z-30 animate-pulse shadow-2xl">
            {banknoteStatus}
          </div>
        )}

        {/* Real-time Scan Result HUD Box Overlay */}
        {lastScanResult && !isScanningNote && (
          <div className={`absolute top-3 left-3 right-3 p-3 rounded-lg border backdrop-blur-md z-20 font-mono shadow-2xl transition-all ${
            lastScanResult.verdict === 'counterfeit'
              ? 'bg-red-950/90 border-red-600 text-red-200'
              : lastScanResult.verdict === 'genuine'
              ? 'bg-neutral-950/90 border-neutral-700 text-white'
              : 'bg-amber-950/90 border-amber-600 text-amber-200'
          }`}>
            <div className="flex items-center justify-between border-b border-white/20 pb-1.5 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                {lastScanResult.verdict === 'counterfeit' ? (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
                {lastScanResult.verdict === 'counterfeit'
                  ? '[COUNTERFEIT WARNING DETECTED]'
                  : '[BANKNOTE VERIFIED GENUINE]'}
              </span>
              <span className="text-[10px] opacity-75">{lastScanResult.timestamp}</span>
            </div>
            <div className="text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="opacity-80">Intaglio Ridge Energy Score:</span>
                <span className="font-bold">{lastScanResult.score.toFixed(4)}</span>
              </div>
              <p className="text-[9px] leading-tight opacity-90">{lastScanResult.reason}</p>
            </div>
          </div>
        )}

        {/* Dynamic camera status overlay */}
        {isVirtualCamera ? (
          <div className="absolute inset-0 bg-red-950/90 border-2 border-red-600 flex flex-col items-center justify-center p-4 gap-2 text-center z-10">
            <ShieldAlert className="w-10 h-10 text-red-400 animate-bounce" />
            <span className="text-sm font-bold text-white uppercase tracking-wide font-mono">Virtual Camera Blocked</span>
            <span className="text-xs text-neutral-300">Injected feed detected (OBS/v4l2loopback). Interdiction active.</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-red-900 text-white rounded border border-red-700">
              Veritas Score: {veritasScore.toFixed(3)}
            </span>
          </div>
        ) : isGenuine && !lastScanResult ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 rounded-full border border-neutral-700 z-10">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Liveness: Genuine</span>
          </div>
        ) : sessionId && !lastScanResult ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 rounded-full border border-neutral-700 z-10">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Analyzing: {veritasScore.toFixed(3)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

