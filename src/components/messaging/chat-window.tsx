"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, Check, CheckCheck, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  reactions?: { emoji: string; count: number; byMe: boolean }[];
  status?: "sent" | "delivered" | "read";
  attachment?: { name: string; type: string; size: string };
}

interface ChatWindowProps {
  conversationName: string;
  isOnline: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onStartCall?: (type: "audio" | "video") => void;
  onTogglePanel?: () => void;
  isTyping?: boolean;
}

const quickEmojis = ["👍", "❤️", "😂", "🔥", "👏", "🎵", "✨", "🙌"];

export function ChatWindow({ conversationName, isOnline, messages, onSendMessage, onStartCall, onTogglePanel, isTyping }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState<Record<string, { emoji: string; count: number; byMe: boolean }[]>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
    setShowEmoji(false);
  }, [input, onSendMessage]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function addEmoji(emoji: string) {
    setInput((prev) => prev + emoji);
  }

  function toggleReaction(msgId: string, emoji: string) {
    setLocalReactions((prev) => {
      const existing = prev[msgId] || [];
      const idx = existing.findIndex((r) => r.emoji === emoji);
      if (idx >= 0) {
        const updated = [...existing];
        if (updated[idx].byMe) {
          updated[idx] = { ...updated[idx], count: updated[idx].count - 1, byMe: false };
          if (updated[idx].count <= 0) updated.splice(idx, 1);
        } else {
          updated[idx] = { ...updated[idx], count: updated[idx].count + 1, byMe: true };
        }
        return { ...prev, [msgId]: updated };
      }
      return { ...prev, [msgId]: [...existing, { emoji, count: 1, byMe: true }] };
    });
    setReactionMenuId(null);
  }

  function getReactions(msg: Message) {
    return localReactions[msg.id] || msg.reactions || [];
  }

  const filteredMessages = searchQuery
    ? messages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar alt={conversationName} size="md" status={isOnline ? "online" : "offline"} />
          <div>
            <p className="text-sm font-semibold text-card-foreground">{conversationName}</p>
            <p className="text-xs text-muted-foreground">
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-colors", showSearch ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
            aria-label="Search messages"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStartCall?.("audio")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Voice call"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStartCall?.("video")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Video call"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            onClick={onTogglePanel}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Toggle info panel"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="flex items-center gap-2 border-b border-border px-5 py-2 bg-muted/30">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in conversation..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
            aria-label="Search messages"
          />
          {searchQuery && (
            <span className="text-[10px] text-muted-foreground">{filteredMessages.length} found</span>
          )}
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground" aria-label="Close search">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {filteredMessages.map((msg) => {
          const reactions = getReactions(msg);
          return (
            <div
              key={msg.id}
              className={cn("group flex", msg.isMine ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex items-end gap-2 max-w-md", msg.isMine && "flex-row-reverse")}>
                {!msg.isMine && <Avatar alt={conversationName} size="sm" />}
                <div className="relative">
                  {/* Attachment */}
                  {msg.attachment && (
                    <div className={cn("mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs", msg.isMine ? "bg-primary/20 text-primary" : "bg-muted")}>
                      <Paperclip className="h-3 w-3" />
                      <span className="truncate">{msg.attachment.name}</span>
                      <span className="text-[10px] opacity-60">{msg.attachment.size}</span>
                    </div>
                  )}
                  {/* Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.isMine ? "gradient-primary text-white rounded-br-md" : "bg-muted text-card-foreground rounded-bl-md"
                    )}
                  >
                    <p>{msg.text}</p>
                    <div className={cn("mt-1 flex items-center gap-1 text-[10px]", msg.isMine ? "text-white/60 justify-end" : "text-muted-foreground")}>
                      <span>{msg.timestamp}</span>
                      {msg.isMine && msg.status === "read" && <CheckCheck className="h-3 w-3 text-blue-300" />}
                      {msg.isMine && msg.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                      {msg.isMine && msg.status === "sent" && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                  {/* Reactions */}
                  {reactions.length > 0 && (
                    <div className={cn("mt-1 flex gap-1", msg.isMine ? "justify-end" : "justify-start")}>
                      {reactions.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => toggleReaction(msg.id, r.emoji)}
                          className={cn("flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] transition-colors", r.byMe ? "border-primary/30 bg-primary/10" : "border-border bg-card")}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Reaction trigger */}
                  <button
                    onClick={() => setReactionMenuId(reactionMenuId === msg.id ? null : msg.id)}
                    className="absolute -top-2 right-0 hidden rounded-full bg-card border border-border p-1 shadow-sm group-hover:flex"
                    aria-label="Add reaction"
                  >
                    <Smile className="h-3 w-3 text-muted-foreground" />
                  </button>
                  {reactionMenuId === msg.id && (
                    <div className={cn("absolute -top-10 z-10 flex gap-1 rounded-xl border border-border bg-card px-2 py-1.5 shadow-lg", msg.isMine ? "right-0" : "left-0")}>
                      {quickEmojis.slice(0, 6).map((e) => (
                        <button key={e} onClick={() => toggleReaction(msg.id, e)} className="text-sm hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <Avatar alt={conversationName} size="sm" />
              <div className="rounded-2xl bg-muted px-4 py-3 rounded-bl-md">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="border-t border-border px-4 py-2 bg-muted/30">
          <div className="flex flex-wrap gap-2">
            {quickEmojis.map((e) => (
              <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1">{e}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-end rounded-2xl border border-border bg-background px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-24"
              aria-label="Message input"
            />
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className={cn("ml-2 shrink-0 transition-colors", showEmoji ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              aria-label="Toggle emoji picker"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="gradient"
            size="md"
            onClick={handleSend}
            disabled={!input.trim()}
            className="h-10 w-10 shrink-0 !p-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
