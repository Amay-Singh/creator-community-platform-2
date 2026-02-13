"use client";

import { useState, useEffect } from "react";
import { CreatorCard } from "@/components/discover/creator-card";
import { SearchFilters, type FilterState } from "@/components/discover/search-filters";
import { PersonalityQuiz } from "@/components/discover/personality-quiz";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

const mockCreators: User[] = [
  {
    id: "1",
    email: "maya@example.com",
    name: "Maya Chen",
    username: "mayachen",
    avatar: undefined,
    bio: "Electronic music producer blending ambient textures with hard-hitting beats. Always looking for visual artists to collaborate with.",
    category: "musician",
    location: "Los Angeles, CA",
    skills: ["Production", "Mixing", "Sound Design", "Ableton"],
    externalLinks: [{ platform: "spotify", url: "https://spotify.com" }],
    followers: 3420,
    following: 245,
    collaborations: 12,
    profileHealth: 92,
    isPremium: true,
    createdAt: "2025-06-15",
    updatedAt: "2026-02-10",
  },
  {
    id: "2",
    email: "alex@example.com",
    name: "Alex Rivera",
    username: "alexrivera",
    avatar: undefined,
    bio: "Photographer capturing the raw energy of urban landscapes. Open to collaborations with musicians and dancers.",
    category: "photographer",
    location: "New York, NY",
    skills: ["Portrait", "Street", "Editorial", "Lightroom"],
    externalLinks: [{ platform: "instagram", url: "https://instagram.com" }],
    followers: 8750,
    following: 512,
    collaborations: 28,
    profileHealth: 88,
    isPremium: false,
    createdAt: "2025-03-22",
    updatedAt: "2026-02-11",
  },
  {
    id: "3",
    email: "jordan@example.com",
    name: "Jordan Lee",
    username: "jordanlee",
    avatar: undefined,
    bio: "Motion designer and animator creating eye-catching visuals for brands and artists alike.",
    category: "designer",
    location: "London, UK",
    skills: ["After Effects", "Cinema 4D", "Figma", "Illustration"],
    externalLinks: [{ platform: "behance", url: "https://behance.net" }],
    followers: 5100,
    following: 330,
    collaborations: 19,
    profileHealth: 95,
    isPremium: true,
    createdAt: "2025-01-10",
    updatedAt: "2026-02-12",
  },
  {
    id: "4",
    email: "sam@example.com",
    name: "Sam Taylor",
    username: "samtaylor",
    avatar: undefined,
    bio: "Indie filmmaker and videographer. I tell stories through the lens. Let's create something beautiful together.",
    category: "videographer",
    location: "Toronto, CA",
    skills: ["Cinematography", "Editing", "Color Grading", "DaVinci Resolve"],
    externalLinks: [{ platform: "youtube", url: "https://youtube.com" }],
    followers: 2890,
    following: 198,
    collaborations: 8,
    profileHealth: 76,
    isPremium: false,
    createdAt: "2025-08-05",
    updatedAt: "2026-02-09",
  },
  {
    id: "5",
    email: "riley@example.com",
    name: "Riley Morgan",
    username: "rileymorgan",
    avatar: undefined,
    bio: "Contemporary dancer and choreographer pushing the boundaries of movement art.",
    category: "dancer",
    location: "Berlin, DE",
    skills: ["Contemporary", "Hip Hop", "Choreography", "Teaching"],
    externalLinks: [{ platform: "instagram", url: "https://instagram.com" }],
    followers: 6200,
    following: 410,
    collaborations: 15,
    profileHealth: 82,
    isPremium: false,
    createdAt: "2025-04-18",
    updatedAt: "2026-02-08",
  },
  {
    id: "6",
    email: "aria@example.com",
    name: "Aria Patel",
    username: "ariapatel",
    avatar: undefined,
    bio: "Singer-songwriter with a passion for folk-electronic fusion. Looking for producers and visual storytellers.",
    category: "musician",
    location: "Nashville, TN",
    skills: ["Vocals", "Songwriting", "Guitar", "Logic Pro"],
    externalLinks: [{ platform: "spotify", url: "https://spotify.com" }],
    followers: 4500,
    following: 289,
    collaborations: 22,
    profileHealth: 90,
    isPremium: true,
    createdAt: "2025-02-28",
    updatedAt: "2026-02-12",
  },
];

export default function ExplorePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [creators, setCreators] = useState<User[]>(mockCreators);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    experience: [],
    location: "",
  });

  useEffect(() => {
    async function loadCreators() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data && data.length > 0) {
        const dbCreators: User[] = data.map((p) => ({
          id: p.id,
          email: p.email || "",
          name: p.full_name || p.username || "Creator",
          username: p.username || "user",
          avatar: p.avatar_url || undefined,
          bio: p.bio || "",
          category: "other" as const,
          location: p.location || "",
          skills: p.skills || [],
          externalLinks: [],
          followers: 0,
          following: 0,
          collaborations: 0,
          profileHealth: p.health_score || 50,
          isPremium: p.is_premium || false,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        // Merge DB creators first, then mock data
        const dbIds = new Set(dbCreators.map((c) => c.id));
        const uniqueMock = mockCreators.filter((c) => !dbIds.has(c.id));
        setCreators([...dbCreators, ...uniqueMock]);
      }
    }
    loadCreators();
  }, []);

  const filteredCreators = creators.filter((creator) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        creator.name.toLowerCase().includes(q) ||
        creator.username.toLowerCase().includes(q) ||
        creator.skills.some((s) => s.toLowerCase().includes(q)) ||
        (creator.location && creator.location.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(creator.category)) {
      return false;
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      if (!creator.location?.toLowerCase().includes(loc)) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explore Creators</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover artists and influencers to collaborate with
        </p>
      </div>

      <SearchFilters
        view={view}
        onViewChange={setView}
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredCreators.length} creator{filteredCreators.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator, idx) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              view="grid"
              isAiRecommended={idx < 2}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCreators.map((creator, idx) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              view="list"
              isAiRecommended={idx < 2}
            />
          ))}
        </div>
      )}

      {filteredCreators.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-semibold text-muted-foreground">No creators found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* P3.6: Personality Quiz for collaboration matching */}
      <PersonalityQuiz className="mt-4" />
    </div>
  );
}
