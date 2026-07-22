import { AUDIO_CONFIG } from './constants';

/**
 * Convert 16-bit PCM samples to Float32Array
 */
export function pcmToFloat32(pcmData: ArrayBuffer): Float32Array {
  const view = new DataView(pcmData);
  const samples = new Float32Array(pcmData.byteLength / 2);

  for (let i = 0; i < samples.length; i++) {
    // Read 16-bit signed integer (little-endian)
    const int16 = view.getInt16(i * 2, true);
    // Convert to float between -1 and 1
    samples[i] = int16 / 32768;
  }

  return samples;
}

/**
 * Convert Float32Array to 16-bit PCM
 */
export function float32ToPcm(float32: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32.length; i++) {
    // Clamp to [-1, 1]
    const sample = Math.max(-1, Math.min(1, float32[i]));
    // Convert to 16-bit signed integer
    const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    // Write 16-bit signed integer (little-endian)
    view.setInt16(i * 2, Math.round(int16), true);
  }

  return buffer;
}

/**
 * Encode Float32Array audio to 16kHz PCM bytes
 */
export function encodeAudioFrame(float32: Float32Array): ArrayBuffer {
  return float32ToPcm(float32);
}

/**
 * Decode PCM bytes to Float32Array
 */
export function decodeAudioFrame(pcmData: ArrayBuffer): Float32Array {
  return pcmToFloat32(pcmData);
}

/**
 * Simple RMS (Root Mean Square) calculation for audio intensity
 */
export function calculateRMS(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

/**
 * Detect audio stress/anomaly using RMS threshold
 */
export function isAudioStressed(samples: Float32Array, threshold: number = 0.3): boolean {
  const rms = calculateRMS(samples);
  return rms > threshold;
}

/**
 * Get audio statistics
 */
export function getAudioStats(samples: Float32Array): {
  rms: number;
  peak: number;
  mean: number;
} {
  let sum = 0;
  let peak = 0;
  let sumSquares = 0;

  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i]);
    sum += abs;
    sumSquares += samples[i] * samples[i];
    if (abs > peak) peak = abs;
  }

  return {
    rms: Math.sqrt(sumSquares / samples.length),
    peak,
    mean: sum / samples.length,
  };
}

/**
 * Resample audio from source rate to target rate
 */
export function resampleAudio(
  source: Float32Array,
  sourceRate: number,
  targetRate: number
): Float32Array {
  const ratio = sourceRate / targetRate;
  const targetLength = Math.ceil(source.length / ratio);
  const target = new Float32Array(targetLength);

  for (let i = 0; i < targetLength; i++) {
    const sourceIndex = i * ratio;
    const sourceIndexFloor = Math.floor(sourceIndex);
    const sourceIndexCeil = Math.ceil(sourceIndex);
    const frac = sourceIndex - sourceIndexFloor;

    if (sourceIndexCeil >= source.length) {
      target[i] = source[sourceIndexFloor];
    } else {
      // Linear interpolation
      target[i] = source[sourceIndexFloor] * (1 - frac) + source[sourceIndexCeil] * frac;
    }
  }

  return target;
}

/**
 * Apply simple high-pass filter to remove low-frequency noise
 */
export function highPassFilter(samples: Float32Array, cutoffHz: number = 100, sampleRate: number = AUDIO_CONFIG.SAMPLE_RATE): Float32Array {
  const filtered = new Float32Array(samples.length);
  const rc = 1.0 / (2.0 * Math.PI * cutoffHz);
  const dt = 1.0 / sampleRate;
  const alpha = dt / (rc + dt);

  filtered[0] = samples[0];
  for (let i = 1; i < samples.length; i++) {
    filtered[i] = alpha * (filtered[i - 1] + samples[i] - samples[i - 1]);
  }

  return filtered;
}

/**
 * Normalize audio samples
 */
export function normalizeAudio(samples: Float32Array): Float32Array {
  const normalized = new Float32Array(samples.length);
  const max = Math.max(...Array.from(samples).map(Math.abs));

  if (max === 0) {
    return normalized;
  }

  for (let i = 0; i < samples.length; i++) {
    normalized[i] = samples[i] / max;
  }

  return normalized;
}
