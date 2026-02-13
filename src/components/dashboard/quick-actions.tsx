"use client";

import Link from "next/link";
import { Users, Sparkles, FolderPlus } from "lucide-react";

const actions = [
  {
    href: "/explore",
    label: "Find Collaborators",
    description: "Discover creators who match your style",
    icon: Users,
    gradient: "from-primary to-secondary-purple",
  },
  {
    href: "/ai-studio",
    label: "AI Tools",
    description: "Generate content with AI assistance",
    icon: Sparkles,
    gradient: "from-secondary-purple to-secondary-rose",
  },
  {
    href: "/collaborations/new",
    label: "Create Project",
    description: "Start a new collaboration project",
    icon: FolderPlus,
    gradient: "from-secondary-emerald to-primary",
  },
];

export function QuickActions() {
  return (
    <section aria-label="Quick actions">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md transition-transform group-hover:scale-110`}
            >
              <action.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-card-foreground">{action.label}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
