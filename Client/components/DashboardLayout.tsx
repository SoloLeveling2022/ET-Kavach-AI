'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSession } from '@/context/SessionContext';
import { 
  ShieldAlert, 
  Activity, 
  Video, 
  FileCheck, 
  GitBranch, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sliders,
  Bell,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { getThreatColor } from '@/lib/colors';
import { ThreatPopupAlert } from '@/components/ThreatPopupAlert';

interface DashboardLayoutProps {
  header: React.ReactNode;
  threatGauge: React.ReactNode;
  audioVisualizer: React.ReactNode;
  liveness: React.ReactNode;
  moneyFlow: React.ReactNode;
  gisMap: React.ReactNode;
  forensicDocket: React.ReactNode;
  persona?: 'citizen' | 'teller' | 'investigator';
}

type TabType = 'THREAT' | 'AUDIO' | 'LIVENESS' | 'MONEY' | 'GIS' | 'DOCKET';

export function DashboardLayout({
  header,
  threatGauge,
  audioVisualizer,
  liveness,
  moneyFlow,
  gisMap,
  forensicDocket,
  persona = 'citizen',
}: DashboardLayoutProps) {
  const { threatIndex, agentScores, sessionId } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('THREAT');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Persona-tailored tab filters (Blueprint Section 1)
  const allTabs = [
    { id: 'THREAT', label: 'Threat Core', icon: ShieldAlert, color: '#ffffff', desc: 'Central Swarm Threat Gauge', personas: ['citizen', 'teller', 'investigator'] },
    { id: 'AUDIO', label: 'Citizen Acoustic', icon: Activity, color: '#ffffff', desc: 'Phoneme Vocal Analysis', personas: ['citizen', 'investigator'] },
    { id: 'LIVENESS', label: 'Veritas & Lumen Ingest', icon: Video, color: '#ffffff', desc: 'Media & Banknote Liveness', personas: ['citizen', 'teller', 'investigator'] },
    { id: 'MONEY', label: 'Nexus Loop Link', icon: GitBranch, color: '#ffffff', desc: 'Circular Transaction Loops', personas: ['teller', 'investigator'] },
    { id: 'GIS', label: 'Vanguard Crime Grid', icon: MapPin, color: '#ffffff', desc: 'Hawkes GIS Patrol Priority', personas: ['investigator'] },
    { id: 'DOCKET', label: 'S.63 BSA Compliance', icon: FileCheck, color: '#ffffff', desc: 'Section 63 BSA Certified Ledger', personas: ['investigator', 'teller'] },
  ] as const;

  const tabs = allTabs.filter(t => t.personas.includes(persona));

  // Scroll position detector for scroll down/up controls
  const handleScroll = () => {
    if (mainContentRef.current) {
      setIsScrolledDown(mainContentRef.current.scrollTop > 80);
    }
  };

  const scrollToBottom = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: mainContentRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Animate tab content change with GSAP
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.97, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.1)' }
      );
    }
  }, [activeTab]);

  // Keyboard navigation for switching tabs (1-6 keys, left/right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (tabs[index]) setActiveTab(tabs[index].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, tabs]);

  // Helper to render the currently active feature component
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'THREAT':
        return threatGauge;
      case 'AUDIO':
        return audioVisualizer;
      case 'LIVENESS':
        return liveness;
      case 'MONEY':
        return moneyFlow;
      case 'GIS':
        return gisMap;
      case 'DOCKET':
        return forensicDocket;
      default:
        return threatGauge;
    }
  };

  const threatColor = getThreatColor(threatIndex);

  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* Session Top Bar */}
      <div className="flex-shrink-0 border-b border-neutral-800 bg-black/90 backdrop-blur-md z-20">
        {header}
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        
        {/* Mobile Sidebar Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/75 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Collapsed Sidebar Expand Chip Button (Shown on RIGHT side when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed md:absolute top-10 right-3 z-30 px-3 py-1.5 bg-neutral-950/90 border border-neutral-700 hover:border-white rounded-lg text-xs font-mono text-white font-bold transition-all shadow-xl hover:bg-neutral-900 cursor-pointer flex items-center gap-2 backdrop-blur-md"
            title="Open Swarm Telemetry Sidebar"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Swarm Telemetry</span>
            <Sliders className="w-3.5 h-3.5 text-neutral-300" />
          </button>
        )}

        {/* Feature Focus Core Screen */}
        <div 
          ref={mainContentRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 flex flex-col items-center p-3 sm:p-4 md:p-5 relative overflow-y-auto w-full custom-scrollbar"
        >
          {/* Holographic Slide Deck Frame */}
          <div className="w-full max-w-5xl flex flex-col relative z-10 space-y-3.5 my-auto">
            
            {/* Top Info Strip */}
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 border border-neutral-800 bg-neutral-950 p-3 px-4 rounded-xl">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold font-mono">Immersive Focus Deck</span>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-mono">
                  {tabs.find(t => t.id === activeTab)?.label} Analysis Screen
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-700">
                  <span className={`w-2 h-2 rounded-full ${threatIndex >= 0.5 ? 'bg-red-500 animate-ping' : 'bg-white'}`} />
                  <span className="font-mono text-xs font-bold text-white">
                    Swarm Risk: {(threatIndex * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Quick Scroll Navigation Controls in Top Bar */}
                <button
                  onClick={isScrolledDown ? scrollToTop : scrollToBottom}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white rounded-full text-[11px] font-mono font-bold text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  title={isScrolledDown ? 'Scroll Up to Focus Screen' : 'Scroll Down to System Feeds'}
                >
                  {isScrolledDown ? (
                    <>
                      <span>Top</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Feeds</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* GSAP Target Content Viewport - Increased vertical height for camera canvas */}
            <div 
              ref={containerRef}
              className="w-full min-h-[460px] sm:min-h-[560px] flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 sm:p-5 shadow-2xl relative overflow-y-auto flex flex-col custom-scrollbar"
            >
              {renderActiveComponent()}
            </div>

            {/* Bottom HUD Nav Deck Controls */}
            <div className="flex justify-center pt-1">
              <div 
                ref={navRef}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-neutral-950 rounded-full border border-neutral-800 shadow-xl overflow-x-auto max-w-full"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all focus:outline-none whitespace-nowrap cursor-pointer ${
                        isActive 
                          ? 'bg-white text-black shadow-lg font-black'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110 text-black' : 'text-neutral-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Floating Action Button (FAB) for Quick Vertical Scroll Navigation */}
          <div className="sticky bottom-3 self-end z-30 mt-2 mr-2">
            <button
              onClick={isScrolledDown ? scrollToTop : scrollToBottom}
              className="p-2.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-white rounded-full text-white font-mono text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
              title={isScrolledDown ? 'Scroll Up to Top' : 'Scroll Down to Feeds'}
            >
              {isScrolledDown ? (
                <>
                  <ChevronUp className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline font-bold">Top</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-white animate-bounce" />
                  <span className="hidden sm:inline font-bold">Feeds</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Sovereign Telemetry Sidebar (OPENING FROM THE RIGHT) */}
        <div 
          ref={sidebarRef}
          className={`fixed md:relative z-40 md:z-10 inset-y-0 right-0 h-full border-l border-neutral-800 bg-neutral-950 flex flex-col flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? 'w-72 sm:w-80 translate-x-0' : 'w-0 translate-x-full md:translate-x-0 border-l-0'
          } overflow-hidden shadow-2xl md:shadow-none`}
        >
          {/* Header with Top Toggle Collapse Button (ON RIGHT SIDE) */}
          <div className="p-3.5 px-4 border-b border-neutral-800 flex items-center justify-between flex-shrink-0 bg-neutral-950">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" />
              Swarm Telemetry
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-700 transition-all focus:outline-none cursor-pointer"
              title="Close Telemetry Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Telemetry Agent Metrics List - Full Vertical Scrollable Section */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 font-mono text-xs custom-scrollbar">
            {agentScores ? (
              Object.entries(agentScores)
                .filter(([agent]) => {
                  const allowed = {
                    citizen: ['phoneme', 'hermes', 'veritas', 'aegis'],
                    teller: ['veritas', 'lumen', 'nexus', 'lex', 'aegis'],
                    investigator: ['phoneme', 'hermes', 'veritas', 'aegis', 'nexus', 'vanguard', 'lumen', 'lex'],
                  }[persona];
                  return allowed ? allowed.includes(agent) : true;
                })
                .map(([agent, score]: [string, any]) => {
                  const isHighThreat = score >= 0.75;
                  const isWarning = score > 0.30;

                  const isTabActive =
                    (activeTab === 'AUDIO' && (agent === 'phoneme' || agent === 'hermes')) ||
                    (activeTab === 'LIVENESS' && (agent === 'veritas' || agent === 'lumen')) ||
                    (activeTab === 'MONEY' && agent === 'nexus') ||
                    (activeTab === 'GIS' && agent === 'vanguard') ||
                    (activeTab === 'DOCKET' && agent === 'lex') ||
                    (activeTab === 'THREAT' && (agent === 'veritas' || agent === 'phoneme'));

                  return (
                    <div
                      key={agent}
                      onClick={() => {
                        if (agent === 'phoneme' || agent === 'hermes') setActiveTab('AUDIO');
                        if (agent === 'veritas' || agent === 'lumen') setActiveTab('LIVENESS');
                        if (agent === 'nexus') setActiveTab('MONEY');
                        if (agent === 'vanguard') setActiveTab('GIS');
                        if (agent === 'lex') setActiveTab('DOCKET');
                      }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isHighThreat
                          ? 'bg-red-950/80 border-red-600 text-red-200 animate-pulse'
                          : isWarning
                          ? 'bg-amber-950/60 border-amber-600 text-amber-200'
                          : isTabActive
                          ? 'bg-neutral-900 border-white text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 font-bold">
                        <span className="uppercase tracking-wider flex items-center gap-1.5">
                          {isTabActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          {agent}-agent
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isTabActive && (
                            <span className="text-[9px] bg-white text-black px-1.5 py-0.2 rounded font-black">
                              FOCUS
                            </span>
                          )}
                          <span>{score.toFixed(3)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHighThreat ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-white'
                          }`}
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-xs text-neutral-500 text-center mt-8 py-4 bg-neutral-900 rounded border border-neutral-800 font-mono animate-pulse">
                Awaiting connection telemetry...
              </div>
            )}
          </div>
        </div>

      </div>
      <ThreatPopupAlert />
    </div>
  );
}

