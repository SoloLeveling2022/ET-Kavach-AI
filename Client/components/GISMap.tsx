'use client';

import React, { useEffect, useRef } from 'react';
import { useSession } from '@/context/SessionContext';

export function GISMap() {
  const { sessionId, agentScores } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vanguardScore = agentScores ? (agentScores as any).vanguard : 0.0;
  const isHighDensityHotspot = vanguardScore > 0.05;

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

    const width = rect.width;
    const height = rect.height;

    function draw() {
      // Clear canvas
      ctx.fillStyle = 'hsl(220, 13%, 9%)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'hsl(220, 10%, 20%)';
      ctx.lineWidth = 0.5;
      const cellSize = 20;
      for (let x = 0; x < width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Indian Cyber-Hotspots (mock map overlay coordinates)
      const hotspots = [
        { name: 'Delhi NCR', x: width * 0.35, y: height * 0.3, intensity: isHighDensityHotspot ? 0.95 : 0.5 },
        { name: 'Mumbai', x: width * 0.25, y: height * 0.65, intensity: 0.6 },
        { name: 'Bengaluru', x: width * 0.45, y: height * 0.75, intensity: 0.4 },
        { name: 'Kolkata', x: width * 0.75, y: height * 0.45, intensity: 0.3 },
      ];

      hotspots.forEach(({ name, x, y, intensity }) => {
        const radius = 12 + intensity * 18;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        const alpha = intensity > 0.7 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 229, 255, 0.15)';
        const color = intensity > 0.7 ? 'rgb(0, 229, 255)' : 'rgb(0, 140, 160)';
        
        gradient.addColorStop(0, alpha);
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Core hotspot dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic coordinate label mapping
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${name} (${intensity.toFixed(2)})`, x + 8, y + 3);
      });

      // Show interdiction zone indicator if Vanguard triggered
      if (isHighDensityHotspot) {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(width * 0.35, height * 0.3, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    const handleResize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    handleResize();

    return () => {
      observer.disconnect();
    };
  }, [isHighDensityHotspot]);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col relative overflow-hidden font-mono">
      <div className="text-xs font-bold text-white mb-2 uppercase tracking-wider shrink-0 flex items-center justify-between border-b border-neutral-800 pb-2">
        <span>Vanguard Spatial Crime Grid</span>
        {isHighDensityHotspot && (
          <span className="text-[10px] text-red-500 font-bold tracking-normal animate-pulse">SELF-EXCITING CLUSTER ACTIVE</span>
        )}
      </div>
      <div className="flex-1 min-h-0 w-full relative overflow-hidden rounded-xl border border-neutral-850">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
