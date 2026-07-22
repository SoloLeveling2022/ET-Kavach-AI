'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { useAuth } from '@/context/AuthContext';
import { formatThreatPercentage, getThreatColor, getThreatLevel } from '@/lib/colors';
import { Shield, Zap, LogOut, Landmark, Scale, UserCheck } from 'lucide-react';

export function SessionHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { sessionId, threatIndex, isInitialized, error } = useSession();
  const { user, logout } = useAuth();
  const threatLevel = getThreatLevel(threatIndex);
  const isHighRisk = threatIndex >= 0.50;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('[Header] Sign out error:', err);
    }
  };

  return (
    <div className="min-h-14 bg-black border-b border-neutral-800 px-3 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 font-sans">
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        {/* Left: Branding & Portal Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => router.push('/select-portal')}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black font-black flex items-center justify-center rounded-lg text-xs sm:text-sm group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wider">KAVACH-AI</div>
              <div className="text-[9px] sm:text-[10px] text-neutral-400 font-mono hidden xs:block">Digital Public Safety</div>
            </div>
          </div>

          {/* Change Portal Button */}
          <button
            onClick={() => router.push('/select-portal')}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white rounded-lg text-[11px] sm:text-xs font-mono text-white font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-300" />
            <span className="hidden xs:inline">Switch Portal</span>
            <span className="xs:hidden">Portals</span>
          </button>
        </div>

        {/* Right Operator Sign Out on Mobile top row */}
        <div className="flex items-center gap-2 sm:hidden">
          {isInitialized && sessionId && (
            <span 
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                isHighRisk 
                  ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
                  : 'bg-neutral-900 text-white border-neutral-700'
              }`}
            >
              {formatThreatPercentage(threatIndex)}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Sign Out Operator"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Navigation Channels */}
        <nav className="hidden lg:flex items-center gap-1.5 border-l border-neutral-800 pl-4 font-mono text-xs">
          <button
            onClick={() => router.push('/citizen')}
            className={`px-3 py-1 rounded transition-all cursor-pointer border ${
              pathname === '/citizen'
                ? 'bg-white text-black font-extrabold border-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent hover:border-neutral-700'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => router.push('/teller')}
            className={`px-3 py-1 rounded transition-all cursor-pointer border ${
              pathname === '/teller'
                ? 'bg-white text-black font-extrabold border-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent hover:border-neutral-700'
            }`}
          >
            Bank Teller
          </button>
          <button
            onClick={() => router.push('/investigator')}
            className={`px-3 py-1 rounded transition-all cursor-pointer border ${
              pathname === '/investigator'
                ? 'bg-white text-black font-extrabold border-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent hover:border-neutral-700'
            }`}
          >
            Investigator
          </button>
        </nav>
      </div>

      {/* Mobile Horizontal Sub-Nav Channels Strip */}
      <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto w-full pt-1 pb-0.5 border-t border-neutral-900 font-mono text-[11px] custom-scrollbar">
        <button
          onClick={() => router.push('/citizen')}
          className={`px-2.5 py-0.5 rounded transition-all whitespace-nowrap cursor-pointer border ${
            pathname === '/citizen'
              ? 'bg-white text-black font-extrabold border-white'
              : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-850'
          }`}
        >
          Citizen
        </button>
        <button
          onClick={() => router.push('/teller')}
          className={`px-2.5 py-0.5 rounded transition-all whitespace-nowrap cursor-pointer border ${
            pathname === '/teller'
              ? 'bg-white text-black font-extrabold border-white'
              : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-850'
          }`}
        >
          Bank Teller
        </button>
        <button
          onClick={() => router.push('/investigator')}
          className={`px-2.5 py-0.5 rounded transition-all whitespace-nowrap cursor-pointer border ${
            pathname === '/investigator'
              ? 'bg-white text-black font-extrabold border-white'
              : 'text-neutral-400 hover:text-white bg-neutral-950 border-neutral-850'
          }`}
        >
          Investigator
        </button>
      </div>

      {/* Center Threat Status on Desktop */}
      <div className="hidden sm:flex items-center gap-4">
        {isInitialized && sessionId ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Threat Level:</span>
              <span 
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  isHighRisk 
                    ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
                    : 'bg-neutral-900 text-white border-neutral-700'
                }`}
              >
                {threatLevel} ({formatThreatPercentage(threatIndex)})
              </span>
            </div>
          </>
        ) : error ? (
          <div className="text-xs font-mono text-red-400">{error}</div>
        ) : (
          <div className="text-xs font-mono text-neutral-400">Initializing...</div>
        )}
      </div>

      {/* Right Desktop Operator & Logout */}
      <div className="hidden sm:flex items-center gap-3">
        {user && (
          <div className="text-right">
            <span className="text-[9px] text-neutral-400 uppercase font-mono block">Operator</span>
            <span className="text-xs font-mono text-white font-bold truncate max-w-[130px] block">
              {user.email || 'operator@kavach.ai'}
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white rounded-lg text-neutral-300 hover:text-white transition-all cursor-pointer"
          title="Sign Out Operator"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

