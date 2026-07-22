// Kavach-AI API Response Types

export interface SessionInitResponse {
  session_id: string;
  ws_audio_url: string;
  ws_sensor_url: string;
  interdiction_budget_ms: number;
}

export interface ThreatResponse {
  session_id: string;
  threat_index: number; // 0.0 - 1.0
  status: string;
  agent_scores: {
    phoneme: number;
    hermes: number;
    veritas: number;
    aegis: number;
    nexus: number;
    vanguard: number;
    lumen: number;
    lex: number;
  };
  sampled_at: string;
}

export interface AudioStreamFrame {
  timestamp: number;
  samples: Int16Array;
}

export interface SensorStreamFrame {
  timestamp: number;
  gyroscope: {
    gx: number;
    gy: number;
    gz: number;
  };
}

export interface MoneyFlowNode {
  id: string;
  label: string;
  value: number;
  type: 'source' | 'destination' | 'intermediary';
}

export interface MoneyFlowEdge {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}

export interface GISHotspot {
  id: string;
  lat: number;
  lon: number;
  intensity: number; // 0.0 - 1.0
  timestamp: string;
}

export interface ForensicDocket {
  merkle_hash: string;
  ecdsa_signature: string;
  timestamp: string;
  system_logs: string[];
}

export interface LivenessCheckResponse {
  is_live: boolean;
  confidence: number;
  error?: string;
}

// Session Context State
export interface SessionContextType {
  sessionId: string | null;
  wsAudioUrl: string | null;
  wsSensorUrl: string | null;
  threatIndex: number;
  agentScores: ThreatResponse['agent_scores'] | null;
  isInitialized: boolean;
  error: string | null;
  isLoading: boolean;
  initSession: () => Promise<void>;
  closeSession: () => Promise<void>;
}
