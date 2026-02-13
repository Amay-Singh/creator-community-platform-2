"use client";

import { Pin, FileText, Image as ImageIcon, X, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MemberPanelProps {
  conversationName: string;
  isGroup: boolean;
  onClose: () => void;
  className?: string;
}

const mockParticipants = [
  { id: "u1", name: "Maya Chen", status: "online" as const, role: "Admin" },
  { id: "u2", name: "Alex Rivera", status: "online" as const, role: "Member" },
  { id: "u3", name: "Sam Taylor", status: "away" as const, role: "Member" },
];

const mockSharedFiles = [
  { id: "sf1", name: "track3-draft.wav", type: "audio", size: "12 MB" },
  { id: "sf2", name: "cover-art.png", type: "image", size: "4.2 MB" },
  { id: "sf3", name: "project-notes.pdf", type: "document", size: "340 KB" },
];

const mockPinnedMessages = [
  { id: "pm1", text: "Deadline for final mix: Feb 21", author: "Maya Chen" },
  { id: "pm2", text: "Use the shared drive for large files", author: "Alex Rivera" },
];

const statusColors: Record<string, string> = {
  online: "bg-secondary-emerald",
  away: "bg-secondary-orange",
  offline: "bg-muted-foreground/40",
};

export function MemberPanel({ conversationName, isGroup, onClose, className }: MemberPanelProps) {
  return (
    <div className={cn("flex h-full flex-col border-l border-border bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Details</h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Participants */}
        <div className="border-b border-border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Participants ({mockParticipants.length})
          </p>
          <div className="space-y-2">
            {mockParticipants.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <div className="relative">
                  <Avatar alt={p.name} size="sm" />
                  <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card", statusColors[p.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{p.name}</p>
                </div>
                {isGroup && p.role === "Admin" && (
                  <Badge variant="outline" size="sm">Admin</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Messages */}
        <div className="border-b border-border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            <Pin className="mr-1 inline h-3 w-3" />
            Pinned ({mockPinnedMessages.length})
          </p>
          <div className="space-y-2">
            {mockPinnedMessages.map((pm) => (
              <div key={pm.id} className="rounded-lg bg-muted/50 px-3 py-2">
                <p className="text-xs text-card-foreground">{pm.text}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">— {pm.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Files */}
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            <FileText className="mr-1 inline h-3 w-3" />
            Shared Files ({mockSharedFiles.length})
          </p>
          <div className="space-y-2">
            {mockSharedFiles.map((f) => (
              <div key={f.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  {f.type === "image" ? <ImageIcon className="h-4 w-4 text-muted-foreground" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-card-foreground truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
