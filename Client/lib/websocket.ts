import { POLLING } from './constants';

export interface WebSocketConfig {
  url: string;
  binaryType?: 'arraybuffer' | 'blob';
  onMessage?: (data: ArrayBuffer | string) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
  autoReconnect?: boolean;
  maxRetries?: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private isManuallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      binaryType: 'arraybuffer',
      autoReconnect: true,
      maxRetries: POLLING.RECONNECT_MAX_ATTEMPTS,
      ...config,
    };
  }

  /**
   * Connect to WebSocket
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManuallyClosed = false;
        this.ws = new WebSocket(this.config.url);

        if (this.config.binaryType) {
          this.ws.binaryType = this.config.binaryType;
        }

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected to', this.config.url);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          if (this.config.onMessage) {
            this.config.onMessage(event.data);
          }
        };

        this.ws.onerror = (error: Event) => {
          if (!this.isManuallyClosed) {
            console.warn('[WebSocket] Transport event:', this.config.url);
          }
          if (this.config.onError) {
            this.config.onError(error);
          }
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Closed');
          if (this.config.onClose) {
            this.config.onClose();
          }

          // Auto-reconnect logic
          if (this.config.autoReconnect && !this.isManuallyClosed) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send data over WebSocket
   */
  public send(data: ArrayBuffer | string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn('[WebSocket] Not connected, cannot send data');
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (
      this.reconnectAttempts >= (this.config.maxRetries || POLLING.RECONNECT_MAX_ATTEMPTS)
    ) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    const backoffMs = POLLING.RECONNECT_BACKOFF_MS * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(
      `[WebSocket] Reconnecting in ${backoffMs}ms (attempt ${this.reconnectAttempts}/${this.config.maxRetries})`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
      });
    }, backoffMs);
  }

  /**
   * Close WebSocket connection
   */
  public close(): void {
    this.isManuallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws ? this.ws.readyState === WebSocket.OPEN : false;
  }

  /**
   * Get ready state
   */
  public getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

/**
 * Create a text-based WebSocket
 */
export function createTextWebSocket(
  url: string,
  onMessage?: (data: string) => void,
  onError?: (error: Event) => void,
  onClose?: () => void
): WebSocketManager {
  return new WebSocketManager({
    url,
    binaryType: 'arraybuffer',
    onMessage: (data) => {
      if (typeof data === 'string' && onMessage) {
        onMessage(data);
      } else if (data instanceof ArrayBuffer && onMessage) {
        const decoder = new TextDecoder();
        onMessage(decoder.decode(data));
      }
    },
    onError,
    onClose,
  });
}

/**
 * Create a binary WebSocket
 */
export function createBinaryWebSocket(
  url: string,
  onMessage?: (data: ArrayBuffer) => void,
  onError?: (error: Event) => void,
  onClose?: () => void
): WebSocketManager {
  return new WebSocketManager({
    url,
    binaryType: 'arraybuffer',
    onMessage: (data) => {
      if (data instanceof ArrayBuffer && onMessage) {
        onMessage(data);
      }
    },
    onError,
    onClose,
  });
}
