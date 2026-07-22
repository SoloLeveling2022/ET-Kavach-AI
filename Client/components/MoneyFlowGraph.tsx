'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { GitBranch, ShieldAlert, Lock, RefreshCw, Cpu, Activity } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  account: string;
  x: number;
  y: number;
  type: 'origin' | 'mule' | 'shell' | 'syndicate' | 'freeze';
  hops: number;
}

export function MoneyFlowGraph() {
  const { sessionId, agentScores } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isSimulatingLoop, setIsSimulatingLoop] = useState(false);

  const rawNexusScore = agentScores ? (agentScores as any).nexus : 0.0;
  const nexusScore = isSimulatingLoop ? 0.885 : rawNexusScore;
  const isMuleLoopDetected = nexusScore > 0.15;
  const isFrozen = nexusScore >= 0.75;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 400;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Node placement matching Neo4j 4-Hop Cypher Topology
    const nodes: GraphNode[] = [
      { id: 'ORIGIN', label: 'Victim Account', account: 'ACC-88402-IN', x: width * 0.18, y: height * 0.3, type: 'origin', hops: 0 },
      { id: 'MULE1', label: 'Layer-1 Mule', account: 'MULE-1092-AX', x: width * 0.45, y: height * 0.2, type: 'mule', hops: 1 },
      { id: 'SHELL', label: 'Shell Co. Pool', account: 'SHL-44910-CY', x: width * 0.82, y: height * 0.35, type: 'shell', hops: 2 },
      { id: 'SYNDICATE', label: 'Blacklisted Ring', account: 'SYN-99011-DR', x: width * 0.7, y: height * 0.75, type: 'syndicate', hops: 3 },
      { id: 'RETURN', label: 'Recirculation Node', account: 'MULE-9920-FB', x: width * 0.32, y: height * 0.78, type: 'mule', hops: 4 },
      { id: 'TARGET', label: 'Core Banking Vault', account: 'CBK-FREEZE-INTERDICT', x: width * 0.5, y: height * 0.5, type: 'freeze', hops: 0 },
    ];

    // Directed edges forming 4-hop circular loop
    const edges = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 }, // Circular Mule Loop back to origin
      { from: 1, to: 5 }, // Freeze trigger link
    ];

    // Particle flow stream state
    const particles: { edgeIndex: number; progress: number; speed: number }[] = [];
    for (let i = 0; i < 24; i++) {
      particles.push({
        edgeIndex: i % edges.length,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      });
    }

    let animationFrame = 0;

    function render() {
      // Clear background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Edges (Transaction Vectors)
      edges.forEach((edge, idx) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        const isFreezeEdge = edge.to === 5;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        if (isMuleLoopDetected && !isFreezeEdge) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
        } else if (isFreezeEdge && isFrozen) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrow markers
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const arrowRadius = 22;
        const arrowX = toNode.x - arrowRadius * Math.cos(angle);
        const arrowY = toNode.y - arrowRadius * Math.sin(angle);

        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.fillStyle = isMuleLoopDetected ? '#ef4444' : '#666666';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -4);
        ctx.lineTo(-7, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Animate Money Flow Particles along edges
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const edge = edges[p.edgeIndex];
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];

        const px = fromNode.x + (toNode.x - fromNode.x) * p.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, isMuleLoopDetected ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isMuleLoopDetected ? '#ef4444' : '#ffffff';
        ctx.shadowColor = isMuleLoopDetected ? '#ef4444' : '#ffffff';
        ctx.shadowBlur = isMuleLoopDetected ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Account Nodes
      nodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isFreezeNode = node.type === 'freeze';

        // Outer glow aura
        if (isMuleLoopDetected || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = isFreezeNode && isFrozen ? 'rgba(239, 68, 68, 0.25)' : isMuleLoopDetected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.15)';
          ctx.fill();
        }

        // Inner Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = isFreezeNode && isFrozen ? '#ef4444' : isMuleLoopDetected && node.type !== 'origin' ? '#ef4444' : '#ffffff';
        ctx.strokeStyle = isSelected ? '#ffffff' : '#262626';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.fill();
        ctx.stroke();

        // Node Short Code Label Inside
        ctx.fillStyle = isFreezeNode && isFrozen ? '#ffffff' : isMuleLoopDetected && node.type !== 'origin' ? '#ffffff' : '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id.substring(0, 3), node.x, node.y);

        // Account Label Below
        ctx.fillStyle = isMuleLoopDetected && node.type !== 'origin' ? '#f87171' : '#a3a3a3';
        ctx.font = '10px monospace';
        ctx.fillText(node.label, node.x, node.y + 28);
      });

      animationFrame = requestAnimationFrame(render);
    }

    render();

    // Handle canvas clicks for node inspection
    function handleCanvasClick(e: MouseEvent) {
      const bounds = canvas.getBoundingClientRect();
      const clickX = e.clientX - bounds.left;
      const clickY = e.clientY - bounds.top;

      const found = nodes.find((n) => {
        const dist = Math.hypot(n.x - clickX, n.y - clickY);
        return dist <= 24;
      });

      setSelectedNode(found || null);
    }

    canvas.addEventListener('click', handleCanvasClick);

    const handleResize = () => {
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const observer = new ResizeObserver(handleResize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isMuleLoopDetected, isFrozen, selectedNode]);

  return (
    <div className="w-full h-full flex flex-col font-mono text-white">
      {/* Header Bar */}
      <div className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-white" />
          <span>Nexus Agent — Neo4j 4-Hop Cypher Network Graph</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatingLoop(!isSimulatingLoop)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              isSimulatingLoop
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSimulatingLoop ? 'animate-spin' : ''}`} />
            <span>{isSimulatingLoop ? 'Reset Loop Test' : '⚡ Simulate Cypher 4-Hop Mule Ring'}</span>
          </button>
          {isMuleLoopDetected && (
            <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold animate-pulse flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> CIRCULAR MULE RING (4-HOPS)
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-black border border-neutral-800 rounded-xl relative overflow-hidden w-full">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Status Alert Banner Overlay */}
        {isFrozen && (
          <div className="absolute top-3 left-3 bg-red-950/90 border border-red-700 text-red-200 p-2.5 rounded-lg backdrop-blur-md flex items-center gap-2 text-xs z-10 shadow-2xl">
            <Lock className="w-4 h-4 text-red-400 animate-bounce" />
            <div>
              <p className="font-extrabold uppercase text-[11px] font-mono">AUTOMATIC CORE BANKING ACCOUNT FREEZE TRIGGERED</p>
              <p className="text-[9px] text-red-300 font-mono">Score: {nexusScore.toFixed(3)} ≥ Threshold 0.75 | SIP Telephony Call Interdicted</p>
            </div>
          </div>
        )}

        {/* Selected Node Inspector HUD Overlay */}
        {selectedNode ? (
          <div className="absolute bottom-3 right-3 bg-neutral-950/95 border border-neutral-700 text-white p-3 rounded-lg backdrop-blur-md text-[10px] font-mono w-64 shadow-2xl z-20">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1 mb-1.5 font-bold">
              <span className="text-white flex items-center gap-1">
                <Cpu className="w-3 h-3 text-white" /> Node Inspector
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-neutral-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-neutral-400">Node ID:</span><span className="text-white font-bold">{selectedNode.id}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Account:</span><span className="text-white">{selectedNode.account}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Cypher Hops:</span><span className="text-white">{selectedNode.hops} Hops</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">Status:</span><span className={selectedNode.type === 'syndicate' || isMuleLoopDetected ? 'text-red-400 font-bold' : 'text-white'}>{selectedNode.type.toUpperCase()}</span></div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 right-3 bg-neutral-900/80 border border-neutral-800 text-neutral-400 p-2 rounded-lg text-[9px] font-mono backdrop-blur-md">
            💡 Click any account node to inspect Cypher traversal metrics
          </div>
        )}

        {/* Metric Counter Footer Overlay */}
        <div className="absolute bottom-3 left-3 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-neutral-300 flex items-center gap-3 backdrop-blur-md">
          <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-white" /> Hops Analyzed: 4</span>
          <span>Centrality Score: {nexusScore.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}
