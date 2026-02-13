"use client";

import { useState } from "react";
import { Calendar, Clock, Link as LinkIcon, Video, Send, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MeetingInviteProps {
  onSendInvite?: (meeting: { title: string; date: string; time: string; link: string }) => void;
  className?: string;
}

export function MeetingInvite({ onSendInvite, className }: MeetingInviteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generateLink() {
    const id = Math.random().toString(36).substring(2, 10);
    const link = `https://colab.app/meet/${id}`;
    setGeneratedLink(link);
    return link;
  }

  function handleSend() {
    if (!title.trim() || !date || !time) return;
    const link = generatedLink || generateLink();
    onSendInvite?.({ title: title.trim(), date, time, link });
    setIsOpen(false);
    setTitle("");
    setDate("");
    setTime("");
    setGeneratedLink(null);
  }

  function handleCopyLink() {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors", className)}
        aria-label="Schedule meeting"
      >
        <Calendar className="h-3.5 w-3.5" />
        Schedule
      </button>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Schedule Meeting</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Project sync-up"
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Meeting title"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Meeting date"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Time</label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Meeting time"
              />
            </div>
          </div>
        </div>

        {/* Generated link */}
        {!generatedLink ? (
          <Button variant="outline" size="sm" onClick={generateLink}>
            <LinkIcon className="h-3.5 w-3.5" />
            Generate Meeting Link
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <LinkIcon className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="flex-1 text-xs text-primary truncate">{generatedLink}</span>
            <button onClick={handleCopyLink} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Copy link">
              {copied ? <Check className="h-3.5 w-3.5 text-secondary-emerald" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="gradient" size="sm" onClick={handleSend} disabled={!title.trim() || !date || !time}>
            <Send className="h-3.5 w-3.5" />
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
