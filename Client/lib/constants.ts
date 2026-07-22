// API Configuration
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8080/api/v1';
export const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE || 'ws://127.0.0.1:8080/api/v1';

export const API_ENDPOINTS = {
  SESSION_INIT: `${API_BASE}/session/init`,
  SESSION_CLOSE: (sessionId: string) => `${API_BASE}/session/${sessionId}/close`,
  THREAT: (sessionId: string) => `${API_BASE}/session/${sessionId}/threat`,
  DOCKET: (sessionId: string) => `${API_BASE}/session/${sessionId}/docket`,
  BANKNOTE: (sessionId: string) => `${API_BASE}/session/${sessionId}/banknote`,
};

export const WS_ENDPOINTS = {
  AUDIO: (sessionId: string) => `${WS_BASE}/stream/audio?session_id=${sessionId}`,
  SENSOR: (sessionId: string) => `${WS_BASE}/stream/sensor?session_id=${sessionId}`,
};

// Threat Thresholds
export const THREAT_THRESHOLDS = {
  SAFE: 0.3,
  SUSPICIOUS: 0.6,
  CRITICAL: 1.0,
};

// Audio Configuration
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  BIT_DEPTH: 16,
  CHUNK_SIZE: 2048, // ScriptProcessorNode requires a power of two
  CHUNK_DURATION_MS: 128,
};

// Sensor Configuration
export const SENSOR_CONFIG = {
  POLLING_RATE: 50, // Hz (20ms)
};

// Animation Durations (ms)
export const ANIMATION = {
  QUICK: 150,
  STANDARD: 300,
  SLOW: 500,
};

// Polling Intervals
export const POLLING = {
  THREAT_INTERVAL: 1500, // 1.5 seconds
  RECONNECT_MAX_ATTEMPTS: 5,
  RECONNECT_BACKOFF_MS: 1000,
};

// Virtual Camera Detection
export const VIRTUAL_CAMERA_BLOCKLIST = [
  'OBS',
  'v4l2loopback',
  'DroidCam',
  'Fake Video Capture Device',
  'ManyCam',
];

// Color Mappings (Monochrome & Red/Yellow Alerts)
export const ACCENT_COLOR = 'hsl(0, 0%, 100%)'; // Pure White Accent

export const THREAT_COLORS = {
  SAFE: 'hsl(0, 0%, 90%)',      // Clean White / Neutral
  WARNING: 'hsl(38, 92%, 50%)',   // Amber / Yellow Warning
  CRITICAL: 'hsl(0, 84%, 60%)', // Red Critical Threat
};

// UI Theme (High Contrast Black & White)
export const THEME = {
  BG_DEEP: 'hsl(0, 0%, 0%)',
  BG_CARD: 'hsl(0, 0%, 7%)',
  BORDER: 'hsl(0, 0%, 20%)',
  TEXT_PRIMARY: 'hsl(0, 0%, 100%)',
  TEXT_SECONDARY: 'hsl(0, 0%, 70%)',
};

// Canvas Settings
export const CANVAS_CONFIG = {
  DEVICE_PIXEL_RATIO: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  LINE_WIDTH: 1.5,
  GRID_SIZE: 32,
};

// Error Messages
export const ERROR_MESSAGES = {
  SESSION_INIT_FAILED: 'Failed to initialize session',
  DEVICE_PERMISSION_DENIED: 'Camera or microphone permission denied',
  VIRTUAL_CAMERA_DETECTED: 'Virtual camera detected - interdiction blocked',
  WEBSOCKET_FAILED: 'WebSocket connection failed',
  API_ERROR: 'API request failed',
  SENSOR_NOT_AVAILABLE: 'Gyroscope sensor not available',
};
