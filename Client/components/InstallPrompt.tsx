'use client';

import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('[InstallPrompt] App installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[InstallPrompt] User response: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (err) {
      console.error('[InstallPrompt] Installation failed:', err);
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-neutral-950 text-white border border-neutral-800 rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4 z-50 font-sans">
      <div className="flex-1">
        <p className="font-bold text-xs uppercase tracking-wider text-white font-mono">Install Kavach-AI PWA</p>
        <p className="text-[10px] text-neutral-400 font-mono">Real-time duress threat protection on home screen</p>
      </div>
      <div className="flex gap-2 font-mono">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-3 py-1.5 rounded text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
        >
          Install
        </button>
      </div>
    </div>
  );
}
