'use client';

import React from 'react';
import { SessionHeader } from '@/components/SessionHeader';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ThreatGauge } from '@/components/ThreatGauge';
import { MoneyFlowGraph } from '@/components/MoneyFlowGraph';
import { GISMap } from '@/components/GISMap';
import { ForensicDocket } from '@/components/ForensicDocket';
import { useThreatPolling } from '@/hooks/useThreatPolling';
import { useSession } from '@/context/SessionContext';
import { ProtectedRoute } from '@/context/AuthContext';
import { Scale, MapPin, GitBranch, FileCheck, ShieldAlert } from 'lucide-react';

export default function InvestigatorPage() {
  const { sessionId, threatIndex, agentScores } = useSession();
  useThreatPolling();

  const vanguardScore = agentScores ? (agentScores as any).vanguard : 0.0;
  const lexScore = agentScores ? (agentScores as any).lex : 0.0;

  return (
    <ProtectedRoute>
      <div className="w-full h-screen max-h-screen overflow-hidden bg-black text-white font-sans flex flex-col">
        <DashboardLayout
          header={<SessionHeader />}
          threatGauge={<ThreatGauge />}
          audioVisualizer={null}
          liveness={null}
          moneyFlow={<MoneyFlowGraph />}
          gisMap={<GISMap />}
          forensicDocket={<ForensicDocket />}
          persona="investigator"
        />
      </div>
    </ProtectedRoute>
  );
}
