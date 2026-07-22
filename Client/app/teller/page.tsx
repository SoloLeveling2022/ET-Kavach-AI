'use client';

import React, { useState, useEffect } from 'react';
import { SessionHeader } from '@/components/SessionHeader';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ThreatGauge } from '@/components/ThreatGauge';
import { LivenessMonitor } from '@/components/LivenessMonitor';
import { MoneyFlowGraph } from '@/components/MoneyFlowGraph';
import { ForensicDocket } from '@/components/ForensicDocket';
import { useThreatPolling } from '@/hooks/useThreatPolling';
import { useSession } from '@/context/SessionContext';
import { ProtectedRoute } from '@/context/AuthContext';
import { Landmark, Camera, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function BankTellerPage() {
  const { sessionId, threatIndex, agentScores } = useSession();
  useThreatPolling();

  const lumenScore = agentScores ? (agentScores as any).lumen : 0.0;
  const veritasScore = agentScores ? (agentScores as any).veritas : 0.0;
  const isInterdicted = threatIndex >= 0.75;

  return (
    <ProtectedRoute>
      <div className="w-full h-screen max-h-screen overflow-hidden bg-black text-white font-sans flex flex-col">
        <DashboardLayout
          header={<SessionHeader />}
          threatGauge={<ThreatGauge />}
          audioVisualizer={null}
          liveness={<LivenessMonitor persona="teller" />}
          moneyFlow={<MoneyFlowGraph />}
          gisMap={null}
          forensicDocket={<ForensicDocket />}
          persona="teller"
        />
      </div>
    </ProtectedRoute>
  );
}
