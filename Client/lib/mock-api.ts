/**
 * Mock API for hackathon prototype
 * Returns realistic threat data without backend dependency
 */

import { ThreatData } from './types';

// Simulated threat scenarios
const threatScenarios = [
  { threat: 0.15, label: 'SAFE', description: 'Normal call' },
  { threat: 0.35, label: 'SUSPICIOUS', description: 'Unusual patterns detected' },
  { threat: 0.55, label: 'ALERT', description: 'Potential threat' },
  { threat: 0.75, label: 'CRITICAL', description: 'High risk detected' },
  { threat: 0.95, label: 'CRITICAL', description: 'Severe threat' },
];

const transactionPatterns = [
  {
    source: 'Unknown Caller',
    banks: ['Bank A', 'Bank B', 'Bank C'],
    destination: 'Target Account',
    amount: 50000,
  },
  {
    source: 'Spoofed ID',
    banks: ['Crypto Exchange', 'Payment Processor'],
    destination: 'Offshore Account',
    amount: 250000,
  },
];

const geolocationHotspots = [
  { x: 0.2, y: 0.3, intensity: 0.8 },
  { x: 0.6, y: 0.5, intensity: 0.6 },
  { x: 0.8, y: 0.2, intensity: 0.4 },
  { x: 0.4, y: 0.8, intensity: 0.7 },
];

let scenarioIndex = 0;
let frameCount = 0;

export async function mockInitializeSession(): Promise<{
  session_id: string;
  device_labels: string[];
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    session_id: `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    device_labels: ['microphone', 'camera', 'gyroscope'],
  };
}

export async function mockGetThreatData(): Promise<ThreatData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Animate through scenarios
  const scenario = threatScenarios[scenarioIndex % threatScenarios.length];
  const transactionPattern = transactionPatterns[scenarioIndex % transactionPatterns.length];

  frameCount++;

  // Switch scenario every 30 frames (every 3 seconds at 10Hz polling)
  if (frameCount % 30 === 0) {
    scenarioIndex = (scenarioIndex + 1) % threatScenarios.length;
  }

  return {
    threat_index: scenario.threat,
    timestamp: new Date().toISOString(),
    agent_scores: {
      voice_analysis: Math.random() * scenario.threat,
      pattern_detection: Math.random() * scenario.threat,
      geolocation: Math.random() * 0.5,
      transaction_analysis: Math.random() * scenario.threat,
    },
    transaction_topology: {
      source: transactionPattern.source,
      intermediate_banks: transactionPattern.banks,
      destination: transactionPattern.destination,
      amount: transactionPattern.amount,
    },
    geolocation_hotspots: geolocationHotspots,
    forensic_metadata: {
      call_duration_seconds: Math.floor(Math.random() * 300) + 60,
      audio_samples_processed: Math.floor(Math.random() * 48000) + 16000,
      stress_level: scenario.threat,
      call_type: scenario.label,
    },
  };
}

export async function mockCloseSession(sessionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('[MockAPI] Session closed:', sessionId);
}

export async function mockRequestPermissions(): Promise<{
  microphone: boolean;
  camera: boolean;
  gyroscope: boolean;
}> {
  // In a real app, this would request actual permissions
  return {
    microphone: true,
    camera: true,
    gyroscope: true,
  };
}

export async function mockGetCallStatus(): Promise<{
  isOnCall: boolean;
  duration: number;
  caller: string;
}> {
  // In a real app, this would check actual call status
  // For demo, randomly return call status
  return {
    isOnCall: Math.random() > 0.7,
    duration: Math.floor(Math.random() * 300),
    caller: 'Unknown Caller',
  };
}

/**
 * Generate realistic audio data for visualization
 */
export function mockGenerateAudioFrame(stressLevel: number): Float32Array {
  const sampleRate = 16000;
  const frameDuration = 0.02; // 20ms frames
  const numSamples = Math.floor((sampleRate * frameDuration) / 1000);

  const samples = new Float32Array(numSamples);

  // Generate realistic voice-like waveform with stress modulation
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const baseFreq = 200 + stressLevel * 200; // Pitch rises with stress
    const harmonics =
      Math.sin(2 * Math.PI * baseFreq * t) +
      0.5 * Math.sin(2 * Math.PI * baseFreq * 2 * t) +
      0.25 * Math.sin(2 * Math.PI * baseFreq * 3 * t);

    // Add amplitude modulation
    const envelope = Math.sin((Math.PI * i) / numSamples);
    samples[i] = (harmonics / 1.75) * (stressLevel * 0.7 + 0.3) * envelope * 0.3;
  }

  return samples;
}
