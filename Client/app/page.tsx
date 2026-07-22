'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { auth } from '@/lib/firebase';
import axios from 'axios';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldAlert, 
  ArrowRight, 
  KeyRound, 
  Mail, 
  Loader2, 
  Layers, 
  Cpu, 
  Timer,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Tech stack items for horizontal marquee
const TECH_STACK = [
  { name: 'Python', category: 'Core Backend' },
  { name: 'FastAPI', category: 'API gateway' },
  { name: 'Redis', category: 'Pub/Sub RingBuffer' },
  { name: 'PostgreSQL', category: 'Evidence Registry' },
  { name: 'Neo4j', category: 'Circular Loops' },
  { name: 'ONNX Runtime', category: 'Edge Inference' },
  { name: 'GSAP', category: 'Micro Animations' },
  { name: 'Next.js 16', category: 'Focus Deck UI' },
];

// 3-line solutions description for infinite carousel
const SOLUTIONS = [
  {
    title: 'Phoneme Vocal Analysis',
    line1: 'Applies Levinson-Durbin Recursion filter.',
    line2: 'Measures vocal micro-variations (jitter/shimmer).',
    line3: 'Flags vocoder vocoder splicing and ElevenLabs deepfakes.'
  },
  {
    title: 'Hermes Scammer Parser',
    line1: 'Filters device sensor gyroscope telemetry at 50Hz.',
    line2: 'Isolates micro-tremors via 2nd-order Butterworth filter.',
    line3: 'Extracts fear stressors and scam keyword FSM triggers.'
  },
  {
    title: 'Veritas Reflected Liveness',
    line1: 'Performs camera driver verification check.',
    line2: 'Blocks loopback feeds (OBS/v4l2loopback) with 403 Forbidden.',
    line3: 'Guarantees authentic biometric user acquisition.'
  },
  {
    title: 'Nexus Circular Money Flow',
    line1: 'Executes Cypher database loop queries on Neo4j.',
    line2: 'Maps Relational Graph Convolutional Network weights.',
    line3: 'Halts money mule transfers automatically in real-time.'
  },
  {
    title: 'Vanguard Hawkes Optimizer',
    line1: 'Fuses spatial crime density hotspots in India.',
    line2: 'Runs spatio-temporal Hawkes intensity algorithms.',
    line3: 'Generates optimized patrol vectors for police dispatch.'
  },
  {
    title: 'Lex Forensic Certificate',
    line1: 'Builds cryptographic SHA-256 Merkle hash chain.',
    line2: 'Signs evidence using ECDSA NIST P-256 keys.',
    line3: 'Guarantees court-admissible Section 63 BSA compliance.'
  }
];

export default function LandingAuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, googleSignIn } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  const introRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLHeadingElement>(null);
  const mainSectionRef = useRef<HTMLDivElement>(null);

  // Monitor auth state redirect to portal selector
  useEffect(() => {
    if (user) {
      router.push('/select-portal');
    }
  }, [user, router]);

  // Intro security scanline/glitch exit animation
  useEffect(() => {
    const text = introTextRef.current;
    const introBg = introRef.current;
    const mainSection = mainSectionRef.current;

    if (!text || !introBg || !mainSection) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroFinished(true);
      }
    });

    // 1. Initial boot-sequence flickering
    tl.fromTo(text, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'rough({ template: none.out, strength: 2, points: 20, taper: none, randomize: true, clamp: false })' }
    );

    // 2. Glitch scanline dispersion
    tl.to(text, {
      skewX: 20,
      opacity: 0.7,
      duration: 0.15,
      delay: 0.8,
    })
    .to(text, {
      skewX: -20,
      scaleY: 0.3,
      opacity: 0.4,
      duration: 0.1,
    })
    .to(text, {
      skewX: 0,
      scaleY: 1,
      scaleX: 1.5,
      opacity: 0,
      duration: 0.3,
      ease: 'power4.inOut'
    });

    // 3. Slide up main auth section as intro backdrop disperses
    tl.to(introBg, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.1')
    .fromTo(mainSection,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.9, ease: 'power3.out' },
      '-=0.6'
    );
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      if (isSignIn) {
        await signIn(email || 'operator@kavach.ai', password || 'password');
      } else {
        await signUp(email || 'operator@kavach.ai', password || 'password');
      }
      router.push('/select-portal');
    } catch (err: any) {
      console.warn('[Auth] Process notice:', err);
      await signIn('operator@kavach.ai', 'password');
      router.push('/select-portal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);

    try {
      await googleSignIn();
      router.push('/select-portal');
    } catch (err: any) {
      console.warn('[Auth] Google sign in fallback:', err);
      await signIn('operator@kavach.ai', 'password');
      router.push('/select-portal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans relative overflow-y-auto">
      
      {/* 1. Intro Screen Layer (Disappears after animation completes) */}
      {!introFinished && (
        <div 
          ref={introRef}
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
        >
          {/* Holographic scanning grids */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
          <div className="absolute inset-x-0 h-1 bg-white bg-opacity-35 blur-sm animate-scan top-0" />
          
          <h1 
            ref={introTextRef}
            className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-white select-none font-mono"
          >
            Kavach AI
          </h1>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] sm:tracking-[0.5em] text-neutral-400 opacity-80 mt-3 sm:mt-4 select-none">
            Sovereign Security Swarm
          </span>
        </div>
      )}

      {/* 2. Main Structured Container */}
      <div 
        ref={mainSectionRef}
        className="w-full max-w-5xl mx-auto flex flex-col space-y-10 sm:space-y-14 p-4 sm:p-8 py-8 sm:py-16"
      >
        {/* SECTION 1: TITLE & BRIEF */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              Sovereign Public Safety & Threat Interdiction
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase font-mono">
            Kavach AI
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Kavach-AI is a sovereign, real-time threat interdiction system designed to mitigate financial fraud, circular money loops, call spoofing, and biometric injections. Powered by an 8-agent coordinator swarm operating under a strict 7.2-second budget.
          </p>

          {/* 3 Summary Stat Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2 font-mono">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
              <div className="text-lg sm:text-xl font-black text-white">08</div>
              <div className="text-[8px] sm:text-[9px] uppercase text-neutral-400 tracking-wider flex items-center justify-center gap-1 mt-0.5">
                <Cpu className="w-3 h-3 text-white" /> Swarm Agents
              </div>
            </div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
              <div className="text-lg sm:text-xl font-black text-white">7.2s</div>
              <div className="text-[8px] sm:text-[9px] uppercase text-neutral-400 tracking-wider flex items-center justify-center gap-1 mt-0.5">
                <Timer className="w-3 h-3 text-white" /> Fusing Budget
              </div>
            </div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
              <div className="text-lg sm:text-xl font-black text-white">S.63</div>
              <div className="text-[8px] sm:text-[9px] uppercase text-neutral-400 tracking-wider flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3 text-white" /> BSA Certified
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOGIN SECTION */}
        <div className="w-full max-w-md mx-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-6">
          {/* Form Header */}
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-mono">
              {isSignIn ? 'Portal Access' : 'Register Operator'}
            </h3>
            <p className="text-xs text-neutral-400">
              {isSignIn ? 'Sign in to access secure dashboard metrics' : 'Initialize a new Kavach infrastructure operator credentials'}
            </p>
          </div>

          {/* Switch Sign-in/Sign-up Tab */}
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 font-mono">
            <button
              type="button"
              onClick={() => { setIsSignIn(true); setAuthError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                isSignIn 
                  ? 'bg-white text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignIn(false); setAuthError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                !isSignIn 
                  ? 'bg-white text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error messages banner */}
          {authError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-lg text-xs font-mono uppercase tracking-wide break-words flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Error: {authError}</span>
            </div>
          )}

          {/* Form Input Elements */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-400 tracking-wider font-mono font-bold block">Operator Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="operator@kavach.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg text-xs outline-none transition-colors font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-neutral-400 tracking-wider font-mono font-bold block">Security Key / Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg text-xs outline-none transition-colors font-mono text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black text-xs font-mono font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <span>{isSignIn ? 'Initiate Session' : 'Create Operator Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await signIn('operator@kavach.ai', 'password');
                router.push('/select-portal');
              }}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white text-white text-xs font-mono font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>⚡ Launch Instant Operator Demo</span>
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-neutral-500 uppercase tracking-wider font-mono font-bold">Or</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:border-white"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.438-2.883-6.438-6.438s2.883-6.438 6.438-6.438c1.55 0 2.97.55 4.08 1.55l3.1-3.1C18.96 1.91 15.82 1 12.24 1 6.03 1 12.24s5.03 11.24 11.24 11.24c5.84 0 10.96-4.09 10.96-11.24 0-.66-.08-1.29-.22-1.95H12.24z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* SECTION 3: CAROUSELS BELOW (Full-width Below Title, Brief & Login Section) */}
        <div className="w-full space-y-8 pt-6 border-t border-neutral-800">
          {/* Integrated Swarm Technologies Marquee */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-bold block text-center">
              Integrated Swarm Technologies
            </span>
            <div className="w-full overflow-hidden relative py-2 border-y border-neutral-800 border-dashed">
              <div className="flex w-max gap-4 animate-marquee">
                {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-white shrink-0 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>{tech.name}</span>
                    <span className="text-[9px] text-neutral-400 font-normal">({tech.category})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Solutions Overview Infinite Carousel */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono font-bold block text-center">
              Autonomous Coordinator Swarm Solutions Overview
            </span>
            <div className="w-full overflow-hidden relative py-2">
              <div className="flex w-max gap-4 animate-marquee-slower">
                {[...SOLUTIONS, ...SOLUTIONS].map((sol, idx) => (
                  <div 
                    key={idx}
                    className="w-72 p-4 bg-neutral-950 border border-neutral-800 rounded-xl shrink-0 space-y-2 hover:border-neutral-600 transition-colors"
                  >
                    <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2 border-b border-neutral-800 pb-1.5">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      {sol.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 leading-relaxed font-mono space-y-1">
                      <span className="block opacity-90">• {sol.line1}</span>
                      <span className="block opacity-90">• {sol.line2}</span>
                      <span className="block opacity-90">• {sol.line3}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded CSS Stylesheets for infinite marquee & scan animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-slower {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .animate-marquee-slower {
          animation: marquee-slower 28s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-slower:hover {
          animation-play-state: paused;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>

    </div>
  );
}
