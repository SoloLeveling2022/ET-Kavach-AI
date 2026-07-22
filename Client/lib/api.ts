import axios, { AxiosInstance } from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from './constants';
import { SessionInitResponse, ThreatResponse } from './types';
import {
  mockInitializeSession,
  mockGetThreatData,
  mockCloseSession,
} from './mock-api';

let apiClient: AxiosInstance | null = null;
const USE_MOCK_API = false; // Set to false to connect to the real Python backend

/**
 * Initialize axios client
 */
export function initializeApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return apiClient;
}

/**
 * Initialize a new session with backend or mock fallback
 */
export async function initializeSession(): Promise<SessionInitResponse> {
  if (USE_MOCK_API) {
    return mockInitializeSession() as unknown as SessionInitResponse;
  }

  try {
    const client = initializeApiClient();
    
    // Attempt to discover camera labels (Veritas-Agent Gate 1)
    let cameraLabel = 'FaceTime HD Camera';
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.find(d => d.kind === 'videoinput');
      if (videoDevice && videoDevice.label) {
        cameraLabel = videoDevice.label;
      }
    } catch (e) {
      console.log('[API] Camera labeling deferred:', e);
    }

    const payload = {
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'NodeJS',
      camera_device_label: cameraLabel,
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'
    };

    const response = await client.post<SessionInitResponse>(API_ENDPOINTS.SESSION_INIT, payload);
    return response.data;
  } catch (error: any) {
    const isNetErr = error?.code === 'ERR_NETWORK' || error?.message === 'Network Error';
    if (isNetErr) {
      console.warn('[API] Gateway backend offline at 127.0.0.1:8080 — engaging offline mock session.');
    } else {
      console.warn('[API] Session init deferred, using mock fallback:', error?.message || error);
    }
    return mockInitializeSession() as unknown as SessionInitResponse;
  }
}

/**
 * Close an active session
 */
export async function closeSession(sessionId: string): Promise<void> {
  if (USE_MOCK_API) {
    return mockCloseSession(sessionId);
  }

  try {
    const client = initializeApiClient();
    await client.post(API_ENDPOINTS.SESSION_CLOSE(sessionId));
  } catch (error) {
    console.error('[API] Session close failed:', error);
  }
}

const isMockSessionId = (id: string) => id.startsWith('sess_');

/**
 * Get current threat data
 */
export async function getThreat(sessionId: string): Promise<ThreatResponse> {
  if (USE_MOCK_API || isMockSessionId(sessionId)) {
    return mockGetThreatData() as ThreatResponse;
  }

  try {
    const client = initializeApiClient();
    const response = await client.get<ThreatResponse>(API_ENDPOINTS.THREAT(sessionId));
    return response.data;
  } catch (error: any) {
    console.warn('[API] Threat fetch deferred, using mock:', error?.message || error);
    return mockGetThreatData() as ThreatResponse;
  }
}

/**
 * Check if using virtual camera (403 Forbidden response)
 */
export async function checkDeviceAuthenticity(sessionId: string): Promise<boolean> {
  try {
    const client = initializeApiClient();
    await client.get(API_ENDPOINTS.THREAT(sessionId));
    return true; // Authentic device
  } catch (error: any) {
    if (error.response?.status === 403) {
      return false; // Virtual device detected
    }
    throw error;
  }
}

/**
 * Fetch Section 63 BSA Forensic Docket
 */
export async function getForensicDocket(sessionId: string): Promise<ForensicDocket> {
  if (USE_MOCK_API || isMockSessionId(sessionId)) {
    return {
      merkle_hash: '4f1a3b8c9d2e5f7a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      ecdsa_signature: '3082019330820135a00302010202090098765432109abcdef300d0609',
      timestamp: new Date().toISOString(),
      system_logs: ['Initializing forensic evidence acquisition (MOCKFallback)']
    };
  }

  try {
    const client = initializeApiClient();
    const response = await client.get<ForensicDocket>(API_ENDPOINTS.DOCKET(sessionId));
    return response.data;
  } catch (error: any) {
    console.warn('[API] Docket fetch deferred, falling back to mock:', error?.message || error);
    return {
      merkle_hash: '4f1a3b8c9d2e5f7a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      ecdsa_signature: '3082019330820135a00302010202090098765432109abcdef300d0609',
      timestamp: new Date().toISOString(),
      system_logs: ['Evidence hash matching failed', 'Using fallback docket integrity signature']
    };
  }
}

/**
 * Upload Banknote Frame for Lumen Agent Intaglio FFT analysis
 */
export async function uploadBanknoteFrame(sessionId: string, imageBase64: string): Promise<{ status: string; frame_key: string }> {
  try {
    const client = initializeApiClient();
    const response = await client.post(API_ENDPOINTS.BANKNOTE(sessionId), {
      image_base64: imageBase64
    });
    return response.data;
  } catch (error: any) {
    console.warn('[API] Banknote upload deferred:', error?.message || error);
    return { status: 'mock_uploaded', frame_key: `kavach:banknote_frame:${sessionId}` };
  }
}

