"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Messages</h2>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search conversations"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
              activeId === conv.id && "bg-primary/5 border-r-2 border-primary"
            )}
            aria-current={activeId === conv.id ? "true" : undefined}
          >
            <Avatar
              alt={conv.name}
              src={conv.avatar}
              size="md"
              status={conv.isOnline ? "online" : "offline"}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-card-foreground truncate">
                  {conv.name}
                  {conv.isGroup && (
                    <span className="ml-1 text-[10px] text-muted-foreground">(group)</span>
                  )}
                </p>
                <span className="text-[10px] text-muted-foreground shrink-0">{conv.timestamp}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2 shrink-0 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
