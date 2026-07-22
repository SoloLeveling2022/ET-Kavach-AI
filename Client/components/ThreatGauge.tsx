'use client';

import React, { useEffect, useRef } from 'react';
import { getThreatColor, getThreatLevel, formatThreatPercentage } from '@/lib/colors';
import { useSession } from '@/context/SessionContext';
import { ANIMATION } from '@/lib/constants';

export function ThreatGauge() {
  const { threatIndex } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const previousThreatRef = useRef(0);
  const targetThreatRef = useRef(threatIndex);

  useEffect(() => {
    targetThreatRef.current = threatIndex;
  }, [threatIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationStartTime = Date.now();

    const handleResize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    handleResize();

    function animate() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(10, Math.min(width, height) / 2 - 25);

      // Smooth threat interpolation
      const elapsed = Date.now() - animationStartTime;
      const duration = ANIMATION.STANDARD;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentThreat = previousThreatRef.current + (targetThreatRef.current - previousThreatRef.current) * easeProgress;

      // Clear canvas
      ctx.fillStyle = 'hsl(220, 13%, 9%)';
      ctx.fillRect(0, 0, width, height);

      // Draw background arc
      ctx.strokeStyle = 'hsl(220, 10%, 25%)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw threat arc
      const threatColor = getThreatColor(currentThreat);
      ctx.strokeStyle = threatColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const endAngle = (currentThreat * Math.PI * 2) - Math.PI / 2;
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle, false);
      ctx.stroke();

      // Draw glow effect for critical threat
      if (getThreatLevel(currentThreat) === 'CRITICAL') {
        ctx.shadowColor = threatColor;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = threatColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle, false);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw center text
      ctx.fillStyle = 'hsl(0, 0%, 95%)';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatThreatPercentage(currentThreat), centerX, centerY - 10);

      ctx.fillStyle = 'hsl(0, 0%, 70%)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(getThreatLevel(currentThreat), centerX, centerY + 25);

      // Draw tick marks
      ctx.strokeStyle = 'hsl(220, 10%, 25%)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x1 = centerX + Math.cos(angle) * (radius - 10);
        const y1 = centerY + Math.sin(angle) * (radius - 10);
        const x2 = centerX + Math.cos(angle) * (radius + 5);
        const y2 = centerY + Math.sin(angle) * (radius + 5);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        previousThreatRef.current = targetThreatRef.current;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }

    animationStartTime = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col relative overflow-hidden font-mono">
      <div className="text-xs font-bold text-white mb-2 uppercase tracking-wider shrink-0 flex items-center justify-between border-b border-neutral-800 pb-2">
        <span>Swarm Threat Gauge</span>
        <span className="text-[10px] text-neutral-400">Real-Time Core Interdiction Index</span>
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
