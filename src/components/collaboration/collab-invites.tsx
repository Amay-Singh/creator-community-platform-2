"use client";

import { useState } from "react";
import { UserPlus, Check, X, Sparkles, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CollabInvite {
  id: string;
  fromName: string;
  fromAvatar?: string;
  projectTitle: string;
  synopsis: string;
  matchReason: string;
  matchScore: number;
  status: "pending" | "accepted" | "declined";
  sentAt: string;
}

const mockInvites: CollabInvite[] = [
  {
    id: "inv1",
    fromName: "Alex Rivera",
    projectTitle: "Street Art Documentary",
    synopsis: "Looking for a music producer to create an original soundtrack for a 20-minute documentary about street art culture in NYC.",
    matchReason: "Your ambient production style pairs well with visual storytelling projects",
    matchScore: 94,
    status: "pending",
    sentAt: "2h ago",
  },
  {
    id: "inv2",
    fromName: "Riley Morgan",
    projectTitle: "Dance Performance Video",
    synopsis: "Need a sound designer for a contemporary dance piece being filmed for a festival submission.",
    matchReason: "Your sound design skills complement Riley's choreography style",
    matchScore: 87,
    status: "pending",
    sentAt: "1d ago",
  },
  {
    id: "inv3",
    fromName: "Jordan Lee",
    projectTitle: "Brand Rebrand Campaign",
    synopsis: "Creating audio branding elements for a complete visual identity overhaul.",
    matchReason: "Previous successful collaboration on similar projects",
    matchScore: 91,
    status: "accepted",
    sentAt: "3d ago",
  },
];

interface CollabInvitesProps {
  className?: string;
}

export function CollabInvites({ className }: CollabInvitesProps) {
  const [invites, setInvites] = useState<CollabInvite[]>(mockInvites);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendMessage, setSendMessage] = useState("");

  function handleAccept(id: string) {
    setInvites((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "accepted" } : inv));
  }

  function handleDecline(id: string) {
    setInvites((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "declined" } : inv));
  }

  function handleSendInvite() {
    if (!sendTo.trim()) return;
    // TODO: Connect to backend API
    setShowSendForm(false);
    setSendTo("");
    setSendMessage("");
  }

  const pendingInvites = invites.filter((i) => i.status === "pending");
  const respondedInvites = invites.filter((i) => i.status !== "pending");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">Collaboration Invites</h3>
        <Button variant="outline" size="sm" onClick={() => setShowSendForm(!showSendForm)}>
          <UserPlus className="h-3.5 w-3.5" />
          Send Invite
        </Button>
      </div>

      {/* Send invite form */}
      {showSendForm && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <input
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            placeholder="Search creators to invite..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search creators"
          />
          <textarea
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            placeholder="Write a message explaining why you'd like to collaborate..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            aria-label="Invitation message"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSendForm(false)}>Cancel</Button>
            <Button variant="gradient" size="sm" onClick={handleSendInvite} disabled={!sendTo.trim()}>
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Pending */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending ({pendingInvites.length})</p>
          {pendingInvites.map((invite) => (
            <div key={invite.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <Avatar alt={invite.fromName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-card-foreground">{invite.fromName}</p>
                    <span className="text-[10px] text-muted-foreground">{invite.sentAt}</span>
                  </div>
                  <p className="text-xs font-medium text-primary mt-0.5">{invite.projectTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{invite.synopsis}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-secondary-purple">
                    <Sparkles className="h-3 w-3" />
                    <span>{invite.matchReason}</span>
                    <Badge variant="primary" size="sm" className="ml-1">{invite.matchScore}% match</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDecline(invite.id)}>
                  <X className="h-3.5 w-3.5" /> Decline
                </Button>
                <Button variant="gradient" size="sm" onClick={() => handleAccept(invite.id)}>
                  <Check className="h-3.5 w-3.5" /> Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responded */}
      {respondedInvites.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">History</p>
          {respondedInvites.map((invite) => (
            <div key={invite.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 opacity-70">
              <Avatar alt={invite.fromName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{invite.projectTitle}</p>
                <p className="text-[10px] text-muted-foreground">from {invite.fromName}</p>
              </div>
              <Badge variant={invite.status === "accepted" ? "success" : "destructive"} size="sm">
                {invite.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
