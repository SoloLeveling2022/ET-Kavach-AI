'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { ShieldAlert, AlertTriangle, X, CheckCircle2, Lock, FileCheck } from 'lucide-react';
import { getThreatColor, getThreatLevel, formatThreatPercentage } from '@/lib/colors';

export function ThreatPopupAlert() {
  const { threatIndex, agentScores } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Trigger popup when threat index rises above 0.50
  useEffect(() => {
    if (threatIndex >= 0.50 && !acknowledged) {
      setIsOpen(true);
    } else if (threatIndex < 0.35) {
      setAcknowledged(false); // Reset when threat returns to normal
      setIsOpen(false);
    }
  }, [threatIndex, acknowledged]);

  if (!isOpen) return null;

  const threatColor = getThreatColor(threatIndex);
  const threatLevel = getThreatLevel(threatIndex);
  const isCritical = threatIndex >= 0.75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div 
        className={`w-full max-w-lg bg-[hsl(220,14%,12%)] border-2 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-5 ${
          isCritical 
            ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse' 
            : 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Top Glowing Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: threatColor }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setAcknowledged(true);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div 
            className={`p-3.5 rounded-2xl flex items-center justify-center ${
              isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-bounce' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                CRITICAL INTERDICTION ALERT
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
              {isCritical ? '🚨 High-Confidence Deepfake Attack' : '⚠️ Suspicious Vocal Anomaly Detected'}
            </h2>
          </div>
        </div>

        {/* Threat Level Meter Card */}
        <div className="bg-[hsl(220,14%,8%)] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Swarm Fused Risk Score</span>
            <div className="text-3xl font-black font-mono tracking-tight text-white mt-0.5">
              {formatThreatPercentage(threatIndex)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Severity Band</span>
            <div 
              className="text-sm font-extrabold uppercase font-mono px-3 py-1 rounded-full border mt-1 inline-block"
              style={{ color: threatColor, borderColor: threatColor, backgroundColor: `${threatColor}15` }}
            >
              {threatLevel}
            </div>
          </div>
        </div>

        {/* Telemetry Breakdown */}
        <div className="space-y-2 text-xs font-mono">
          <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Realtime Agent Swarm Telemetry:
          </div>
          
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-300">Phoneme / Audio Agent (Synthesizer Risk):</span>
            <span className="font-bold text-amber-400 font-mono">
              {agentScores?.phoneme ? (agentScores.phoneme * 100).toFixed(1) + '%' : 'HIGH RISK'}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-300">Voiceprint Agent (Acoustic Duress):</span>
            <span className="font-bold text-red-400 font-mono">
              {agentScores?.hermes ? (agentScores.hermes * 100).toFixed(1) + '%' : 'CLONE DETECTED'}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-300">Intent Agent (Social Engineering Vector):</span>
            <span className="font-bold text-white font-mono">
              {agentScores?.veritas ? (agentScores.veritas * 100).toFixed(1) + '%' : 'EVALUATING'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              setIsOpen(false);
              setAcknowledged(true);
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Acknowledge & Interdict</span>
          </button>
        </div>
      </div>
    </div>
  );
}
