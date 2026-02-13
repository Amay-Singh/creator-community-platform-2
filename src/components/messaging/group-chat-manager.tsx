"use client";

import { useState } from "react";
import { Plus, Users, Settings, X, UserPlus, Crown, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GroupMember {
  id: string;
  name: string;
  role: "admin" | "member";
  status: "online" | "away" | "offline";
}

interface GroupChatManagerProps {
  onCreateGroup?: (name: string, memberIds: string[]) => void;
  className?: string;
}

const availableContacts = [
  { id: "u1", name: "Maya Chen", status: "online" as const },
  { id: "u2", name: "Alex Rivera", status: "online" as const },
  { id: "u3", name: "Sam Taylor", status: "away" as const },
  { id: "u4", name: "Jordan Lee", status: "offline" as const },
  { id: "u5", name: "Riley Morgan", status: "online" as const },
  { id: "u6", name: "Aria Patel", status: "away" as const },
];

export function GroupChatManager({ onCreateGroup, className }: GroupChatManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"name" | "members">("name");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  function toggleMember(id: string) {
    setSelectedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleCreate() {
    if (!groupName.trim() || selectedMembers.size === 0) return;
    onCreateGroup?.(groupName.trim(), Array.from(selectedMembers));
    setIsOpen(false);
    setStep("name");
    setGroupName("");
    setSelectedMembers(new Set());
  }

  function handleClose() {
    setIsOpen(false);
    setStep("name");
    setGroupName("");
    setSelectedMembers(new Set());
  }

  const filteredContacts = searchQuery
    ? availableContacts.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableContacts;

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className={className}>
        <Users className="h-3.5 w-3.5" />
        New Group
      </Button>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">Create Group Chat</h3>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      {step === "name" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Group Name</label>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Urban Beats Team"
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Group name"
              autoFocus
            />
          </div>
          <Button variant="gradient" size="sm" onClick={() => setStep("members")} disabled={!groupName.trim()}>
            Next — Add Members
          </Button>
        </div>
      )}

      {step === "members" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Adding members to <span className="font-semibold text-card-foreground">{groupName}</span>
          </p>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search contacts"
          />

          {selectedMembers.size > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selectedMembers).map((id) => {
                const contact = availableContacts.find((c) => c.id === id);
                return contact ? (
                  <Badge key={id} variant="primary" size="sm" className="gap-1">
                    {contact.name}
                    <button onClick={() => toggleMember(id)} aria-label={`Remove ${contact.name}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          <div className="max-h-48 space-y-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => toggleMember(contact.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                  selectedMembers.has(contact.id) ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"
                )}
              >
                <Avatar alt={contact.name} size="sm" status={contact.status} />
                <span className="flex-1 text-sm font-medium text-card-foreground">{contact.name}</span>
                {selectedMembers.has(contact.id) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px]">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setStep("name")}>Back</Button>
            <Button variant="gradient" size="sm" onClick={handleCreate} disabled={selectedMembers.size === 0}>
              <UserPlus className="h-3.5 w-3.5" />
              Create ({selectedMembers.size})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
