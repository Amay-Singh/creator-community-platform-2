"use client";

import { useState, useEffect } from "react";
import { Plus, FolderOpen, Archive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard, type Project } from "@/components/collaboration/project-card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/client";

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
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function loadProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("collaborations")
        .select("*, collaboration_members(user_id, profiles(full_name))")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const dbProjects: Project[] = data.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          title: c.title as string,
          description: (c.description as string) || "",
          status: (c.status as "active" | "completed" | "archived") || "active",
          members: ((c.collaboration_members as Record<string, unknown>[]) || []).map((m: Record<string, unknown>) => ({
            name: ((m.profiles as Record<string, unknown>)?.full_name as string) || "Member",
          })),
          tasksTotal: 0,
          tasksDone: 0,
          createdAt: new Date(c.created_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));
        setProjects([...dbProjects, ...mockProjects]);
      }
    }
    loadProjects();
  }, []);

  async function handleCreateProject() {
    if (!newTitle.trim() || !user) return;
    setCreating(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collaborations")
      .insert({ title: newTitle, description: newDesc, owner_id: user.id })
      .select()
      .single();
    if (data && !error) {
      await supabase.from("collaboration_members").insert({
        collaboration_id: data.id,
        user_id: user.id,
        role: "owner",
        status: "accepted",
      });
      const newProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        status: "active",
        members: [{ name: user.user_metadata?.full_name || "You" }],
        tasksTotal: 0,
        tasksDone: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    setShowCreate(false);
    setNewTitle("");
    setNewDesc("");
    setCreating(false);
  }

  const filtered = projects.filter((p) => p.status === activeTab);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collaborations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your projects and team work</p>
        </div>
        <Button variant="gradient" onClick={() => setShowCreate(true)}>
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
              {projects.filter((p) => p.status === tab.id).length}
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
      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-card-foreground">New Project</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Project Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Describe your project..."
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button variant="gradient" className="flex-1" onClick={handleCreateProject} isLoading={creating}>Create Project</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
