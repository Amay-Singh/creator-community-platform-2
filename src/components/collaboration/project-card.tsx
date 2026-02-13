"use client";

import Link from "next/link";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProjectMember {
  name: string;
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  members: ProjectMember[];
  tasksTotal: number;
  tasksDone: number;
  createdAt: string;
}

const statusVariants: Record<string, "success" | "primary" | "default"> = {
  active: "primary",
  completed: "success",
  archived: "default",
};

export function ProjectCard({ project }: { project: Project }) {
  const progress = project.tasksTotal > 0 ? Math.round((project.tasksDone / project.tasksTotal) * 100) : 0;

  return (
    <Link
      href={`/collaborations/${project.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <Badge variant={statusVariants[project.status]} size="sm">
              {project.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold text-card-foreground">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Members */}
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, i) => (
                <Avatar key={i} alt={member.name} src={member.avatar} size="sm" className="ring-2 ring-card" />
              ))}
              {project.members.length > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-card">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Task count */}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {project.tasksDone}/{project.tasksTotal}
          </span>
        </div>

        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          {project.createdAt}
        </span>
      </div>
    </Link>
  );
}

export type { Project };
