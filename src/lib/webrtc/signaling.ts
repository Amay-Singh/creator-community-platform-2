"use client";

import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * STUN/TURN server configuration.
 * Free public STUN servers + optional TURN via env vars.
 */
export function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (turnUrl) {
    servers.push({
      urls: turnUrl,
      username: turnUsername || "",
      credential: turnCredential || "",
    });
  }

  return servers;
}

export type SignalType = "offer" | "answer" | "ice-candidate" | "hang-up";

export interface SignalPayload {
  type: SignalType;
  callId: string;
  senderId: string;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit | null;
}

/**
 * WebRTC Signaling Service using Supabase Realtime broadcast.
 * Handles SDP offer/answer exchange and ICE candidate relay.
 */
export class SignalingService {
  private channel: RealtimeChannel | null = null;
  private supabase = createClient();
  private callId: string;
  private userId: string;
  private onSignal: (payload: SignalPayload) => void;

  constructor(callId: string, userId: string, onSignal: (payload: SignalPayload) => void) {
    this.callId = callId;
    this.userId = userId;
    this.onSignal = onSignal;
  }

  connect() {
    this.channel = this.supabase.channel(`call:${this.callId}`, {
      config: { broadcast: { self: false } },
    });

    this.channel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        const signal = payload as SignalPayload;
        if (signal.senderId !== this.userId) {
          this.onSignal(signal);
        }
      })
      .subscribe();

    return this;
  }

  async sendOffer(offer: RTCSessionDescriptionInit) {
    await this.broadcast({
      type: "offer",
      callId: this.callId,
      senderId: this.userId,
      data: offer,
    });
  }

  async sendAnswer(answer: RTCSessionDescriptionInit) {
    await this.broadcast({
      type: "answer",
      callId: this.callId,
      senderId: this.userId,
      data: answer,
    });
  }

  async sendIceCandidate(candidate: RTCIceCandidateInit) {
    await this.broadcast({
      type: "ice-candidate",
      callId: this.callId,
      senderId: this.userId,
      data: candidate,
    });
  }

  async sendHangUp() {
    await this.broadcast({
      type: "hang-up",
      callId: this.callId,
      senderId: this.userId,
      data: null,
    });
  }

  private async broadcast(payload: SignalPayload) {
    if (!this.channel) return;
    await this.channel.send({
      type: "broadcast",
      event: "signal",
      payload,
    });
  }

  disconnect() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
