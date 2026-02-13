"use client";

import { useState } from "react";
import { Mic, MicOff, Camera, CameraOff, Monitor, PhoneOff, Users, Maximize2, Signal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
}

interface VideoCallProps {
  callType: "audio" | "video";
  callerName: string;
  onEndCall: () => void;
  className?: string;
}

const mockParticipants: Participant[] = [
  { id: "p1", name: "You", isMuted: false, isCameraOff: false, isSpeaking: false },
  { id: "p2", name: "Maya Chen", isMuted: false, isCameraOff: false, isSpeaking: true },
];

export function VideoCall({ callType, callerName, onEndCall, className }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(callType === "video");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState("0:42");

  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col bg-gray-900", isFullscreen ? "" : "m-4 rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Signal className="h-4 w-4 text-secondary-emerald" />
            <span className="text-xs text-white/70">Good quality</span>
          </div>
          <span className="text-xs text-white/50">{callDuration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{callerName}</span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 flex items-center justify-center p-6 gap-4">
        {callType === "video" ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
            {mockParticipants.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "relative aspect-video rounded-2xl overflow-hidden",
                  p.isSpeaking ? "ring-2 ring-secondary-emerald" : ""
                )}
              >
                {p.isCameraOff ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <Avatar alt={p.name} size="xl" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700">
                    <Avatar alt={p.name} size="xl" />
                    <p className="absolute bottom-4 left-4 text-sm font-medium text-white bg-black/40 rounded-lg px-2 py-1">
                      {p.name}
                    </p>
                  </div>
                )}
                {p.isMuted && (
                  <div className="absolute top-3 right-3 rounded-full bg-red-500/80 p-1.5">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Avatar alt={callerName} size="xl" className="h-32 w-32" />
            <div className="text-center">
              <p className="text-xl font-semibold text-white">{callerName}</p>
              <p className="mt-1 text-sm text-white/60">{callDuration}</p>
            </div>
            <div className="flex gap-3">
              {mockParticipants.length > 2 && (
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
                  <Users className="h-4 w-4 text-white/70" />
                  <span className="text-xs text-white/70">{mockParticipants.length}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pb-8 pt-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        {callType === "video" && (
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              !isCameraOn ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
          </button>
        )}

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            isScreenSharing ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
          )}
          aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          <Monitor className="h-6 w-6" />
        </button>

        <button
          onClick={onEndCall}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="End call"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
