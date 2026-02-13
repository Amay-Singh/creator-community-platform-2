"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "completed" | "in_progress" | "upcoming";
  assignee?: string;
}

const mockMilestones: Milestone[] = [
  { id: "ms1", title: "Project Brief Finalized", description: "Complete project scope, deliverables, and timeline agreement", dueDate: "Jan 28", status: "completed", assignee: "Jordan Lee" },
  { id: "ms2", title: "First Draft Complete", description: "All tracks recorded and rough-mixed, visual concepts approved", dueDate: "Feb 7", status: "completed", assignee: "Maya Chen" },
  { id: "ms3", title: "Review & Feedback Round", description: "Team review of all drafts with consolidated feedback", dueDate: "Feb 14", status: "in_progress", assignee: "All Members" },
  { id: "ms4", title: "Final Production", description: "Master audio, finalize visuals, create promotional material", dueDate: "Feb 21", status: "upcoming", assignee: "Sam Taylor" },
  { id: "ms5", title: "Launch & Distribution", description: "Publish to platforms, social media campaign, press outreach", dueDate: "Feb 28", status: "upcoming", assignee: "Alex Rivera" },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-secondary-emerald", bgColor: "bg-secondary-emerald", lineColor: "bg-secondary-emerald" },
  in_progress: { icon: Clock, color: "text-primary", bgColor: "bg-primary", lineColor: "bg-primary" },
  upcoming: { icon: Circle, color: "text-muted-foreground", bgColor: "bg-muted-foreground/40", lineColor: "bg-border" },
};

interface MilestonesTimelineProps {
  projectId: string;
  className?: string;
}

export function MilestonesTimeline({ projectId, className }: MilestonesTimelineProps) {
  const [milestones] = useState<Milestone[]>(mockMilestones);
  const completed = milestones.filter((m) => m.status === "completed").length;
  const total = milestones.length;
  const progressPct = Math.round((completed / total) * 100);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Milestones</h3>
          <p className="text-xs text-muted-foreground">{completed} of {total} completed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{progressPct}%</span>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-0">
        {milestones.map((milestone, idx) => {
          const config = statusConfig[milestone.status];
          const Icon = config.icon;
          const isLast = idx === milestones.length - 1;

          return (
            <div key={milestone.id} className="relative flex gap-4 pb-6">
              {/* Timeline line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5",
                    config.lineColor
                  )}
                />
              )}

              {/* Icon */}
              <div className="relative z-10 flex shrink-0">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card",
                  milestone.status === "completed" ? "border-secondary-emerald" :
                  milestone.status === "in_progress" ? "border-primary" : "border-border"
                )}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 rounded-xl border bg-card p-4 transition-all",
                milestone.status === "in_progress" ? "border-primary/30 shadow-sm" : "border-border"
              )}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{milestone.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                  <Badge
                    variant={
                      milestone.status === "completed" ? "success" :
                      milestone.status === "in_progress" ? "primary" : "outline"
                    }
                    size="sm"
                  >
                    {milestone.status === "in_progress" ? "In Progress" : milestone.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    Due {milestone.dueDate}
                  </span>
                  {milestone.assignee && (
                    <span>Assigned: {milestone.assignee}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
