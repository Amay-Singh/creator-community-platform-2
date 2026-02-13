"use client";

import { useState } from "react";
import { ArrowLeft, Users, FileText, Settings, Layout, Flag, PenTool, UserPlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/collaboration/kanban-board";
import { FileManager } from "@/components/collaboration/file-manager";
import { CollabInvites } from "@/components/collaboration/collab-invites";
import { TeamPresence } from "@/components/collaboration/team-presence";
import { Whiteboard } from "@/components/collaboration/whiteboard";
import { MilestonesTimeline } from "@/components/collaboration/milestones-timeline";

type Tab = "board" | "files" | "members" | "milestones" | "whiteboard" | "invites" | "settings";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "board", label: "Board", icon: Layout },
  { id: "files", label: "Files", icon: FileText },
  { id: "milestones", label: "Milestones", icon: Flag },
  { id: "whiteboard", label: "Whiteboard", icon: PenTool },
  { id: "members", label: "Members", icon: Users },
  { id: "invites", label: "Invites", icon: UserPlus },
  { id: "settings", label: "Settings", icon: Settings },
];

const mockMembers = [
  { name: "Maya Chen", role: "Owner", status: "online" as const },
  { name: "Alex Rivera", role: "Member", status: "online" as const },
  { name: "Sam Taylor", role: "Member", status: "away" as const },
];

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("board");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/collaborations"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Back to collaborations"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Urban Beats EP</h1>
              <Badge variant="primary">Active</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              A collaborative EP blending electronic beats with urban photography visuals.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {mockMembers.map((member) => (
              <Avatar key={member.name} alt={member.name} size="sm" status={member.status} className="ring-2 ring-card" />
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={activeTab === tab.id}
          >
            <tab.icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {activeTab === "board" && <KanbanBoard />}

          {activeTab === "files" && <FileManager projectId="p1" />}

          {activeTab === "milestones" && <MilestonesTimeline projectId="p1" />}

          {activeTab === "whiteboard" && <Whiteboard projectId="p1" />}

          {activeTab === "members" && (
            <div className="rounded-2xl border border-border bg-card shadow-card">
              <div className="divide-y divide-border">
                {mockMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar alt={member.name} size="md" status={member.status} />
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant={member.role === "Owner" ? "primary" : "outline"} size="sm">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "invites" && <CollabInvites />}

          {activeTab === "settings" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-semibold text-card-foreground">Project Settings</h3>
              <p className="mt-1 text-xs text-muted-foreground">Manage project details and permissions.</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Project Name</label>
                  <input
                    type="text"
                    defaultValue="Urban Beats EP"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea
                    defaultValue="A collaborative EP blending electronic beats with urban photography visuals."
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="gradient" size="sm">Save Changes</Button>
                  <Button variant="outline" size="sm" className="text-secondary-rose">Archive Project</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Team Presence (P4.5) */}
        <div className="hidden w-60 shrink-0 lg:block">
          <TeamPresence projectId="p1" />
        </div>
      </div>
    </div>
  );
}
