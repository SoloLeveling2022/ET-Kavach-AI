'use client';

import React, { useEffect, useRef, useState } from 'react';
import { decodeAudioFrame, getAudioStats } from '@/lib/audio';

interface AudioVisualizerProps {
  audioData?: ArrayBuffer;
}

export function AudioVisualizer({ audioData }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);
  const [rms, setRms] = useState(0);
  const [peak, setPeak] = useState(0);

  // Store incoming audio data
  useEffect(() => {
    if (audioData) {
      try {
        const samples = decodeAudioFrame(audioData);
        audioBufferRef.current.push(samples);

        // Keep only last 5 frames in buffer
        if (audioBufferRef.current.length > 5) {
          audioBufferRef.current.shift();
        }

        // Update stats
        const stats = getAudioStats(samples);
        setRms(stats.rms);
        setPeak(stats.peak);
      } catch (err) {
        console.error('[AudioVisualizer] Failed to decode audio:', err);
      }
    }
  }, [audioData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrame = 0;
    let frameCount = 0;

    function animate() {
      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let i = 0; i < width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw oscilloscope waveform
      if (audioBufferRef.current.length > 0) {
        const combinedSamples = new Float32Array(
          audioBufferRef.current.reduce((sum, buf) => sum + buf.length, 0)
        );
        let offset = 0;
        for (const buf of audioBufferRef.current) {
          combinedSamples.set(buf, offset);
          offset += buf.length;
        }

        // Determine color based on RMS (stress detection)
        const stressColor = rms > 0.3 ? '#ef4444' : '#ffffff';
        ctx.strokeStyle = stressColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const samplesPerPixel = Math.max(1, Math.floor(combinedSamples.length / width));
        for (let x = 0; x < width; x++) {
          const sampleIndex = Math.floor(x * samplesPerPixel);
          const sample = combinedSamples[sampleIndex] || 0;
          const y = height / 2 - sample * (height / 2);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      } else {
        // Fallback animation when no audio data
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin((x + frameCount) / 50) * (height / 4);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw RMS level indicator
      ctx.fillStyle = '#a3a3a3';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`RMS: ${rms.toFixed(3)}`, 8, 16);
      ctx.fillText(`Peak: ${peak.toFixed(3)}`, 8, 28);

      frameCount += 1;
      animationFrame = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [rms, peak]);

  return (
    <div className="w-full min-h-[420px] sm:min-h-[480px] flex flex-col font-mono">
      <div className="text-xs font-bold text-white mb-3 uppercase tracking-wider flex items-center justify-between border-b border-neutral-800 pb-2">
        <span>Citizen Acoustic — Real-Time Vocal Oscilloscope</span>
        <span className="text-[10px] text-neutral-400 font-mono">16kHz PCM Ingestion</span>
      </div>
      <div className="flex-1 min-h-0 bg-black border border-neutral-800 rounded-xl relative overflow-hidden w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
