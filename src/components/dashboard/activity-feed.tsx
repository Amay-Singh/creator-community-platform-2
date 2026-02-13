"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockActivities = [
  {
    id: "1",
    user: { name: "Maya Chen", avatar: null },
    action: "started a new collaboration",
    target: "Urban Beats Project",
    time: "5 minutes ago",
    type: "collaboration" as const,
  },
  {
    id: "2",
    user: { name: "Alex Rivera", avatar: null },
    action: "followed you",
    target: null,
    time: "20 minutes ago",
    type: "follow" as const,
  },
  {
    id: "3",
    user: { name: "Jordan Lee", avatar: null },
    action: "uploaded new portfolio items to",
    target: "Street Photography Collection",
    time: "1 hour ago",
    type: "portfolio" as const,
  },
  {
    id: "4",
    user: { name: "Sam Taylor", avatar: null },
    action: "completed a task in",
    target: "Music Video Shoot",
    time: "2 hours ago",
    type: "task" as const,
  },
  {
    id: "5",
    user: { name: "Riley Morgan", avatar: null },
    action: "left a review on your profile",
    target: null,
    time: "3 hours ago",
    type: "review" as const,
  },
];

const typeBadge: Record<string, { variant: "primary" | "secondary" | "success" | "warning"; label: string }> = {
  collaboration: { variant: "primary", label: "Collab" },
  follow: { variant: "secondary", label: "Follow" },
  portfolio: { variant: "success", label: "Portfolio" },
  task: { variant: "warning", label: "Task" },
  review: { variant: "primary", label: "Review" },
};

export function ActivityFeed() {
  return (
    <section aria-label="Recent activity">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="divide-y divide-border">
          {mockActivities.map((activity) => {
            const badge = typeBadge[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3 p-4">
                <Avatar alt={activity.user.name} src={activity.user.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground">
                    <span className="font-semibold">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                    {activity.target && (
                      <>
                        {" "}
                        <span className="font-medium text-card-foreground">{activity.target}</span>
                      </>
                    )}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
