"use client";

import { Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockSuggestions = [
  {
    id: "1",
    name: "Aria Patel",
    category: "Musician",
    matchScore: 92,
    reason: "Shares your interest in electronic music production",
    avatar: null,
  },
  {
    id: "2",
    name: "Kai Nakamura",
    category: "Videographer",
    matchScore: 88,
    reason: "Complementary skills for your upcoming project",
    avatar: null,
  },
  {
    id: "3",
    name: "Luna Vasquez",
    category: "Visual Artist",
    matchScore: 85,
    reason: "Active in your local creative community",
    avatar: null,
  },
];

export function AiSuggestions() {
  return (
    <section aria-label="AI-powered suggestions">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Suggested for You</h2>
          <div className="flex h-5 items-center gap-1 rounded-full bg-primary/10 px-2">
            <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-semibold text-primary">AI</span>
          </div>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">See all</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {mockSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <Avatar alt={suggestion.name} src={suggestion.avatar} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">
                  {suggestion.name}
                </p>
                <Badge variant="primary" size="sm">{suggestion.category}</Badge>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-primary"
                  style={{ width: `${suggestion.matchScore}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-primary">{suggestion.matchScore}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{suggestion.reason}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="gradient" size="sm" className="flex-1 text-xs">
                Collaborate
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
