"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SignalingService, getIceServers, type SignalPayload } from "./signaling";

export type CallStatus = "idle" | "ringing" | "connecting" | "connected" | "ended";

interface UseWebRTCOptions {
  callId: string | null;
  userId: string;
  isCaller: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
}

export function useWebRTC({ callId, userId, isCaller, onRemoteStream, onCallEnded }: UseWebRTCOptions) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const signalingRef = useRef<SignalingService | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const handleSignal = useCallback(async (signal: SignalPayload) => {
    const pc = pcRef.current;
    if (!pc) return;

    switch (signal.type) {
      case "offer": {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data as RTCSessionDescriptionInit));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await signalingRef.current?.sendAnswer(answer);

        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];
        setStatus("connecting");
        break;
      }
      case "answer": {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data as RTCSessionDescriptionInit));
        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidatesRef.current = [];
        setStatus("connecting");
        break;
      }
      case "ice-candidate": {
        if (signal.data) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.data as RTCIceCandidateInit));
          } else {
            pendingCandidatesRef.current.push(signal.data as RTCIceCandidateInit);
          }
        }
        break;
      }
      case "hang-up": {
        endCall();
        break;
      }
    }
  }, []);

  const startCall = useCallback(async (videoEnabled = true) => {
    if (!callId) return;

    setStatus("ringing");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: videoEnabled,
    });
    setLocalStream(stream);

    const pc = new RTCPeerConnection({ iceServers: getIceServers() });
    pcRef.current = pc;

    const remote = new MediaStream();
    setRemoteStream(remote);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      event.streams[0]?.getTracks().forEach((track) => {
        remote.addTrack(track);
      });
      onRemoteStream?.(remote);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingRef.current?.sendIceCandidate(event.candidate.toJSON());
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatus("connected");
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        endCall();
      }
    };

    const signaling = new SignalingService(callId, userId, handleSignal);
    signaling.connect();
    signalingRef.current = signaling;

    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await signaling.sendOffer(offer);
    }
  }, [callId, userId, isCaller, handleSignal, onRemoteStream]);

  const endCall = useCallback(() => {
    signalingRef.current?.sendHangUp();
    signalingRef.current?.disconnect();
    signalingRef.current = null;

    pcRef.current?.close();
    pcRef.current = null;

    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setStatus("ended");
    onCallEnded?.();
  }, [localStream, onCallEnded]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  }, [localStream]);

  useEffect(() => {
    return () => {
      signalingRef.current?.disconnect();
      pcRef.current?.close();
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    status,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
