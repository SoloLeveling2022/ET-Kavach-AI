'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Landmark, 
  Scale, 
  Sliders, 
  ArrowRight, 
  UserCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function SelectPortalPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const portals = [
    {
      id: 'citizen',
      path: '/citizen',
      title: 'Vulnerable Citizen Protection Channel',
      tag: 'CITIZEN PWA',
      icon: ShieldCheck,
      description: 'Real-time WebRTC 16kHz audio stream, 50Hz duress sensor telemetry & automated scam call interdiction.',
    },
    {
      id: 'teller',
      path: '/teller',
      title: 'Bank Teller & Interdiction Station',
      tag: 'FINANCIAL TELLER',
      icon: Landmark,
      description: 'Circular money loop detection, banknote liveness verification, and real-time wire transfer freeze.',
    },
    {
      id: 'investigator',
      path: '/investigator',
      title: 'Law Enforcement / Investigator Portal',
      tag: 'INVESTIGATOR GIS',
      icon: Scale,
      description: 'Hawkes spatial crime grid patrol optimization, Neo4j transaction graph analysis & S.63 BSA forensic certificates.',
    },
    {
      id: 'dashboard',
      path: '/dashboard',
      title: 'Central Swarm Command Dashboard',
      tag: 'COMMAND CORE',
      icon: Sliders,
      description: 'Full sovereign agent swarm telemetry focus deck, real-time threat index gauge & cross-modal intelligence.',
    },
  ];

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-black text-white font-sans flex flex-col justify-between p-4 sm:p-6 md:p-12 overflow-y-auto">
        {/* Top Header */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between border-b border-neutral-800 pb-4 sm:pb-6 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-black font-black flex items-center justify-center rounded-lg text-base sm:text-lg">
              K
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">KAVACH-AI</h1>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-mono">Digital Public Safety Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-neutral-400 font-mono uppercase block">Authenticated Operator</span>
              <span className="text-xs font-mono text-white font-bold">{user?.email || 'operator@kavach.ai'}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 sm:p-2.5 bg-neutral-900 border border-neutral-700 hover:border-white rounded-lg text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Portal Selection Core */}
        <div className="w-full max-w-6xl mx-auto my-6 sm:my-10 space-y-6 sm:space-y-8 flex-1">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800 inline-block">
              SELECT OPERATOR PORTAL & WORKFLOW
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              Which operational interface would you like to enter?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
              Choose an specialized portal suited for your role. You can switch between portals at any time using the navigation header.
            </p>
          </div>

          {/* Grid of Portals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.id}
                  onClick={() => router.push(portal.path)}
                  className="bg-neutral-950 border border-neutral-800 hover:border-white p-4 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 sm:space-y-6 group hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 sm:p-3 bg-white text-black rounded-xl">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 group-hover:border-white transition-colors">
                        {portal.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-neutral-200 transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 sm:mt-2 leading-relaxed">
                        {portal.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform pt-1">
                    <span>Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-6xl mx-auto border-t border-neutral-800 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs font-mono text-neutral-500 text-center sm:text-left">
          <span>Kavach-AI Digital Safety Infrastructure v0.1.0</span>
          <span>Interdiction Budget: &lt; 7200ms</span>
        </div>
      </div>
    </ProtectedRoute>
  );
}
