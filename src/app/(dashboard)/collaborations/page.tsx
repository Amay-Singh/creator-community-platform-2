"use client";

import { useState } from "react";
import { Plus, FolderOpen, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard, type Project } from "@/components/collaboration/project-card";
import { cn } from "@/lib/utils";

const mockProjects: Project[] = [
  {
    id: "p1",
    title: "Urban Beats EP",
    description: "A collaborative EP blending electronic beats with urban photography visuals. Includes 6 tracks with accompanying visual art.",
    status: "active",
    members: [
      { name: "Maya Chen" },
      { name: "Alex Rivera" },
      { name: "Sam Taylor" },
    ],
    tasksTotal: 12,
    tasksDone: 7,
    createdAt: "Jan 28, 2026",
  },
  {
    id: "p2",
    title: "Dance Film Series",
    description: "A 3-part short film series combining contemporary dance with cinematic storytelling.",
    status: "active",
    members: [
      { name: "Riley Morgan" },
      { name: "Sam Taylor" },
    ],
    tasksTotal: 8,
    tasksDone: 3,
    createdAt: "Feb 2, 2026",
  },
  {
    id: "p3",
    title: "Portfolio Rebrand",
    description: "Complete visual rebrand of portfolio including new logo, color palette, and showcase design.",
    status: "active",
    members: [
      { name: "Jordan Lee" },
      { name: "Aria Patel" },
    ],
    tasksTotal: 6,
    tasksDone: 1,
    createdAt: "Feb 8, 2026",
  },
  {
    id: "p4",
    title: "Summer Festival Promo",
    description: "Promotional materials for upcoming summer music festival including poster, social content, and video teaser.",
    status: "completed",
    members: [
      { name: "Maya Chen" },
      { name: "Jordan Lee" },
      { name: "Alex Rivera" },
      { name: "Sam Taylor" },
    ],
    tasksTotal: 10,
    tasksDone: 10,
    createdAt: "Dec 15, 2025",
  },
];

type TabId = "active" | "completed" | "archived";
const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "active", label: "Active", icon: FolderOpen },
  { id: "completed", label: "Completed", icon: FolderOpen },
  { id: "archived", label: "Archived", icon: Archive },
];

export default function CollaborationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("active");

  const filtered = mockProjects.filter((p) => p.status === activeTab);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collaborations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your projects and team work</p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={activeTab === tab.id}
          >
            <tab.icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
            <span className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
              activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {mockProjects.filter((p) => p.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-semibold text-muted-foreground">No {activeTab} projects</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === "active" ? "Create a new project to get started" : `You don't have any ${activeTab} projects yet`}
          </p>
        </div>
      )}
    </div>
  );
}
