type MessageHandler = (data: unknown) => void;
type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

interface WebSocketManagerOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number;
  private reconnectInterval: number;
  private currentAttempt = 0;
  private handlers = new Map<string, Set<MessageHandler>>();
  private status: ConnectionStatus = "disconnected";
  private onStatusChange?: (status: ConnectionStatus) => void;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(options: WebSocketManagerOptions) {
    this.url = options.url;
    this.reconnectAttempts = options.reconnectAttempts ?? 5;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.onStatusChange = options.onStatusChange;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.currentAttempt = 0;
        this.setStatus("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const type = parsed.type as string;
          if (type && this.handlers.has(type)) {
            this.handlers.get(type)!.forEach((handler) => handler(parsed.payload));
          }
          if (this.handlers.has("*")) {
            this.handlers.get("*")!.forEach((handler) => handler(parsed));
          }
        } catch {
          // Non-JSON message — forward to wildcard handlers
          if (this.handlers.has("*")) {
            this.handlers.get("*")!.forEach((handler) => handler(event.data));
          }
        }
      };

      this.ws.onclose = () => {
        this.setStatus("disconnected");
        this.attemptReconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.setStatus("disconnected");
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.currentAttempt = this.reconnectAttempts; // prevent reconnect
    this.ws?.close();
    this.ws = null;
    this.setStatus("disconnected");
  }

  send(type: string, payload: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn("[WebSocketManager] Cannot send — not connected");
      return;
    }
    this.ws.send(JSON.stringify({ type, payload }));
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(type)?.delete(handler);
      if (this.handlers.get(type)?.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  off(type: string, handler: MessageHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  private attemptReconnect(): void {
    if (this.currentAttempt >= this.reconnectAttempts) return;

    this.currentAttempt++;
    this.setStatus("reconnecting");

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * this.currentAttempt);
  }
}

// Singleton for app-wide use
let instance: WebSocketManager | null = null;

export function getWebSocketManager(url?: string): WebSocketManager {
  if (!instance && url) {
    instance = new WebSocketManager({ url });
  }
  if (!instance) {
    // Default to a placeholder URL — override in production
    instance = new WebSocketManager({ url: "wss://api.colab.app/ws" });
  }
  return instance;
}
