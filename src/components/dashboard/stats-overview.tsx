"use client";

import { TrendingUp, Users, FolderOpen, Eye } from "lucide-react";

const stats = [
  {
    label: "Profile Health",
    value: "85%",
    change: "+5%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-secondary-emerald bg-secondary-emerald/10",
  },
  {
    label: "Followers",
    value: "1,247",
    change: "+23",
    trend: "up" as const,
    icon: Users,
    color: "text-primary bg-primary/10",
  },
  {
    label: "Active Projects",
    value: "4",
    change: "+1",
    trend: "up" as const,
    icon: FolderOpen,
    color: "text-secondary-purple bg-secondary-purple/10",
  },
  {
    label: "Profile Views",
    value: "3.2K",
    change: "+12%",
    trend: "up" as const,
    icon: Eye,
    color: "text-secondary-orange bg-secondary-orange/10",
  },
];

export function StatsOverview() {
  return (
    <section aria-label="Statistics overview">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-secondary-emerald">{stat.change}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-card-foreground">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
