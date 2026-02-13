"use client";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  lastActivity?: string;
}

const mockTeam: TeamMember[] = [
  { id: "tm1", name: "Maya Chen", status: "online", lastActivity: "Editing track 3" },
  { id: "tm2", name: "Alex Rivera", status: "online", lastActivity: "Viewing files" },
  { id: "tm3", name: "Sam Taylor", status: "away", lastActivity: "Last seen 15m ago" },
  { id: "tm4", name: "Jordan Lee", status: "offline", lastActivity: "Last seen 2h ago" },
];

const statusColors: Record<string, string> = {
  online: "bg-secondary-emerald",
  away: "bg-secondary-orange",
  offline: "bg-muted-foreground/40",
};

interface TeamPresenceProps {
  projectId: string;
  className?: string;
}

export function TeamPresence({ projectId, className }: TeamPresenceProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-4 shadow-card", className)}>
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Team</h3>
      <div className="space-y-2">
        {mockTeam.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="relative">
              <Avatar alt={member.name} src={member.avatar} size="sm" />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                  statusColors[member.status]
                )}
                aria-label={member.status}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{member.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{member.lastActivity}</p>
            </div>
            {member.status === "online" && (
              <span className="flex h-2 w-2 rounded-full bg-secondary-emerald animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
