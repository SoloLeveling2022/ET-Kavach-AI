'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Camera, MapPin, AlertCircle, Check, X } from 'lucide-react';

interface Permission {
  name: string;
  status: 'granted' | 'denied' | 'prompt' | 'pending';
  icon: React.ReactNode;
  description: string;
}

export function PermissionsRequest() {
  const [permissions, setPermissions] = useState<Permission[]>([
    { name: 'microphone', status: 'pending', icon: <Mic className="w-5 h-5 text-white" />, description: 'WebRTC vocal phoneme analysis' },
    { name: 'camera', status: 'pending', icon: <Camera className="w-5 h-5 text-white" />, description: 'Veritas optical liveness check' },
    { name: 'geolocation', status: 'pending', icon: <MapPin className="w-5 h-5 text-white" />, description: 'Vanguard Hawkes spatial mapping' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [allGranted, setAllGranted] = useState(false);

  useEffect(() => {
    // Check permission status
    const checkPermissions = async () => {
      const updated = await Promise.all(
        permissions.map(async (perm) => {
          try {
            if (navigator.permissions && navigator.permissions.query) {
              const result = await navigator.permissions.query({
                name: perm.name as PermissionName,
              });
              return { ...perm, status: result.state as any };
            }
            return perm;
          } catch (err) {
            console.log(`[Permissions] Query failed for ${perm.name}:`, err);
            return perm;
          }
        })
      );

      setPermissions(updated);

      const granted = updated.filter((p) => p.status === 'granted').length;
      const total = updated.length;

      if (granted === 0 && total > 0) {
        setIsOpen(true);
      }

      setAllGranted(granted === total);
    };

    checkPermissions();
  }, []);

  const requestPermission = async (permissionName: string) => {
    try {
      let stream;

      if (permissionName === 'microphone') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('[Permissions] Microphone granted');
      } else if (permissionName === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('[Permissions] Camera granted');
      } else if (permissionName === 'geolocation') {
        navigator.geolocation.getCurrentPosition(
          () => console.log('[Permissions] Geolocation granted'),
          () => console.log('[Permissions] Geolocation denied')
        );
        return;
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      setPermissions((prev) =>
        prev.map((p) =>
          p.name === permissionName ? { ...p, status: 'granted' } : p
        )
      );
    } catch (err) {
      console.error(`[Permissions] Request failed for ${permissionName}:`, err);
      setPermissions((prev) =>
        prev.map((p) =>
          p.name === permissionName ? { ...p, status: 'denied' } : p
        )
      );
    }
  };

  const handleRequestAll = async () => {
    for (const perm of permissions) {
      if (perm.status !== 'granted') {
        await requestPermission(perm.name);
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    const granted = permissions.filter((p) => p.status === 'granted').length;
    if (granted === permissions.length) {
      setAllGranted(true);
      setTimeout(() => setIsOpen(false), 500);
    }
  };

  if (allGranted && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating badge */}
      {!allGranted && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 bg-neutral-900 border border-neutral-700 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold z-40 hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5 text-white" />
          <span>Permissions Request</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1 uppercase tracking-wide font-mono flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-white" />
              <span>Enable Telemetry Ingestion</span>
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Kavach-AI requires telemetry permissions for live threat analysis:
            </p>

            <div className="space-y-3 mb-6">
              {permissions.map((perm) => (
                <div
                  key={perm.name}
                  className="flex items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg">
                      {perm.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white capitalize font-mono">
                        {perm.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">{perm.description}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold font-mono">
                    {perm.status === 'granted' ? (
                      <span className="text-white flex items-center gap-1"><Check className="w-4 h-4" /></span>
                    ) : perm.status === 'denied' ? (
                      <span className="text-red-500 flex items-center gap-1"><X className="w-4 h-4" /></span>
                    ) : (
                      <span className="text-neutral-500">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 font-mono">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-lg text-xs text-neutral-400 hover:text-white transition-colors border border-neutral-800 cursor-pointer"
              >
                Skip
              </button>
              <button
                onClick={handleRequestAll}
                className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
              >
                Enable All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
