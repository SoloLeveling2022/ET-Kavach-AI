'use client';

import React from 'react';
import useSWR from 'swr';
import { Download, CheckCircle, Loader } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { getForensicDocket } from '@/lib/api';

export function ForensicDocket() {
  const { sessionId } = useSession();

  // Poll docket details dynamically from backend
  const { data: docket, error, isLoading } = useSWR(
    sessionId ? ['docket', sessionId] : null,
    () => (sessionId ? getForensicDocket(sessionId) : null),
    {
      refreshInterval: 3000, // Refresh every 3 seconds to capture Lex certification
      revalidateOnFocus: false,
    }
  );

  const handleDownloadJSON = () => {
    if (!docket) return;
    const json = JSON.stringify(docket, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bsa-docket-${sessionId || 'session'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDFReport = () => {
    if (!docket) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Section 63 BSA Forensic Certificate — ${sessionId}</title>
        <style>
          body { font-family: 'Courier New', monospace; margin: 40px; color: #111; background: #fff; }
          .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .subtitle { font-size: 12px; color: #444; margin-top: 5px; }
          .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; background: #fafafa; }
          .label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #555; }
          .value { font-size: 12px; font-weight: bold; word-break: break-all; margin-top: 4px; color: #000; }
          .footer { margin-top: 40px; border-top: 1px solid #000; padding-top: 15px; font-size: 10px; color: #666; text-align: center; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">BHARATIYA SAKSHYA ADHINIYAM (BSA) SECTION 63 CERTIFICATE</div>
          <div class="subtitle">Kavach-AI Sovereign Threat Intelligence Infrastructure — Court-Admissible Docket</div>
        </div>

        <div class="section">
          <div class="label">Session Identifier</div>
          <div class="value">${sessionId}</div>
        </div>

        <div class="section">
          <div class="label">Certification Timestamp</div>
          <div class="value">${docket.timestamp}</div>
        </div>

        <div class="section">
          <div class="label">SHA-256 Evidence Chain Merkle Hash</div>
          <div class="value">${docket.merkle_hash}</div>
        </div>

        <div class="section">
          <div class="label">ECDSA P-256 Digital Certificate Signature</div>
          <div class="value">${docket.ecdsa_signature}</div>
        </div>

        <div class="section">
          <div class="label">Chain of Custody & Audit Logs</div>
          <ul>
            ${docket.system_logs.map(log => `<li>${log}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          Digitally Signed under Section 63 BSA 2023. Valid for judicial submission across Indian law enforcement jurisdictions.
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (!sessionId) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 font-mono">
        <span className="text-xs text-neutral-400">Awaiting session init to certify evidence...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="text-xs font-mono font-bold text-white mb-3 uppercase tracking-wider flex items-center justify-between">
        <span>Section 63 BSA Docket</span>
        {isLoading && <Loader className="w-3.5 h-3.5 animate-spin text-white" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Status */}
        <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded border border-neutral-800">
          <CheckCircle className="w-4 h-4 shrink-0 text-white" />
          <span className="text-xs font-mono text-white font-bold">Forensic Ledger Sealed</span>
        </div>

        {/* Merkle Hash */}
        <div className="bg-black p-3 rounded-lg border border-neutral-800">
          <div className="text-[10px] text-neutral-400 mb-1 uppercase tracking-wider font-mono font-bold">
            Evidence Chain Hash (SHA-256)
          </div>
          <div className="font-mono text-xs text-white font-bold break-all">
            {docket?.merkle_hash || 'Calculating evidence tree...'}
          </div>
        </div>

        {/* ECDSA Signature */}
        <div className="bg-black p-3 rounded-lg border border-neutral-800">
          <div className="text-[10px] text-neutral-400 mb-1 uppercase tracking-wider font-mono font-bold">
            Digital Signature (ECDSA P-256)
          </div>
          <div className="font-mono text-xs text-neutral-300 break-all">
            {docket?.ecdsa_signature || 'Awaiting swarm seal...'}
          </div>
        </div>

        {/* System Logs / Chain of Custody */}
        <div className="bg-black p-3 rounded-lg border border-neutral-800">
          <div className="text-[10px] text-neutral-400 mb-1 uppercase tracking-wider font-mono font-bold">
            Section 63 Compliance Logs
          </div>
          <ul className="space-y-1 font-mono text-[10px] text-neutral-300 list-disc pl-4">
            {docket?.system_logs.map((log, index) => (
              <li key={index} className="break-words">{log}</li>
            )) || <li>Loading compliance state logs...</li>}
          </ul>
        </div>
      </div>

      {/* Dual Export Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 font-mono">
        <button
          onClick={handleExportPDFReport}
          disabled={!docket}
          className="px-1.5 sm:px-2 py-2 bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <Download className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black shrink-0" />
          <span>Print S.63 PDF</span>
        </button>
        <button
          onClick={handleDownloadJSON}
          disabled={!docket}
          className="px-1.5 sm:px-2 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer border border-neutral-700"
        >
          <Download className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white shrink-0" />
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  );
}

