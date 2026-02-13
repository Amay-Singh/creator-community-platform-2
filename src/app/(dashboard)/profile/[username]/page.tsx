"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Link as LinkIcon, Instagram, Youtube, Globe, Music, Play, Image as ImageIcon } from "lucide-react";
import { PortfolioLightbox } from "@/components/discover/portfolio-lightbox";
import { ProfileReviews } from "@/components/discover/profile-reviews";
import { AiContentValidator } from "@/components/discover/ai-content-validator";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  spotify: Music,
  website: Globe,
  behance: Globe,
  github: Globe,
  other: LinkIcon,
};

const mockPortfolioItems: PortfolioItem[] = [
  { id: "pf1", title: "Urban Frequencies EP Cover", description: "Album artwork for the collab EP", mediaType: "image", url: "https://picsum.photos/seed/pf1/800/800", thumbnailUrl: "https://picsum.photos/seed/pf1/200/200", createdAt: "2026-01-15" },
  { id: "pf2", title: "Studio Session BTS", description: "Behind-the-scenes footage from the recording", mediaType: "video", url: "", createdAt: "2026-01-20" },
  { id: "pf3", title: "Ambient Textures Vol. 2", description: "Sample pack preview", mediaType: "audio", url: "", createdAt: "2026-02-01" },
  { id: "pf4", title: "Live Performance @ Echo Park", mediaType: "image", url: "https://picsum.photos/seed/pf4/800/600", thumbnailUrl: "https://picsum.photos/seed/pf4/200/200", createdAt: "2025-12-10" },
  { id: "pf5", title: "Collab with Alex Rivera", description: "Photo-music crossover project", mediaType: "image", url: "https://picsum.photos/seed/pf5/800/800", thumbnailUrl: "https://picsum.photos/seed/pf5/200/200", createdAt: "2025-11-25" },
  { id: "pf6", title: "Beat Making Process", mediaType: "video", url: "", createdAt: "2025-11-15" },
];

const mockCollabs = [
  { id: "c1", title: "Urban Beats EP", partner: "Alex Rivera", status: "active" as const, role: "Producer" },
  { id: "c2", title: "Dance Film Series", partner: "Riley Morgan", status: "active" as const, role: "Sound Designer" },
  { id: "c3", title: "Summer Festival Promo", partner: "Jordan Lee", status: "completed" as const, role: "Music Director" },
];

type ProfileTab = "about" | "portfolio" | "collaborations" | "reviews";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("about");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [username, setUsername] = useState<string>("");

  // Resolve params
  if (!username) {
    params.then((p) => setUsername(p.username));
  }

  const creator = {
    id: "1",
    name: "Maya Chen",
    username: username || "creator",
    bio: "Electronic music producer blending ambient textures with hard-hitting beats. Always looking for visual artists to collaborate with on immersive audio-visual experiences.",
    category: "Musician",
    location: "Los Angeles, CA",
    skills: ["Production", "Mixing", "Sound Design", "Ableton", "Synthesis", "Mastering"],
    externalLinks: [
      { platform: "spotify" as const, url: "https://spotify.com", label: "Spotify" },
      { platform: "instagram" as const, url: "https://instagram.com", label: "Instagram" },
      { platform: "youtube" as const, url: "https://youtube.com", label: "YouTube" },
    ],
    followers: 3420,
    following: 245,
    collaborations: 12,
    profileHealth: 92,
  };

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "collaborations", label: "Collaborations" },
    { id: "reviews", label: "Reviews" },
  ];

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-48 rounded-2xl gradient-primary opacity-80 sm:h-56" />
        <div className="absolute -bottom-12 left-6 sm:left-8">
          <Avatar alt={creator.name} size="xl" status="online" className="ring-4 ring-card" />
        </div>
      </div>

      {/* Profile Header */}
      <div className="pt-14 px-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{creator.name}</h1>
            <p className="text-sm text-muted-foreground">@{creator.username}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="primary">{creator.category}</Badge>
              {creator.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {creator.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="gradient">Follow</Button>
            <Button variant="outline">Collaborate</Button>
            <Button variant="ghost">Message</Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 flex gap-8">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{creator.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{creator.following.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{creator.collaborations}</p>
            <p className="text-xs text-muted-foreground">Collaborations</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{creator.profileHealth}%</p>
            <p className="text-xs text-muted-foreground">Profile Health</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: About */}
      {activeTab === "about" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-card-foreground mb-2">About</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{creator.bio}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-card-foreground mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {creator.skills.map((skill) => (
                <Badge key={skill} variant="secondary" size="md">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-card-foreground mb-3">Links</h2>
            <div className="flex flex-wrap gap-3">
              {creator.externalLinks.map((link) => {
                const Icon = platformIcons[link.platform] || LinkIcon;
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label || link.platform}
                  </a>
                );
              })}
            </div>
          </div>
          <AiContentValidator contentId={creator.id} contentType="bio" />
        </div>
      )}

      {/* Tab Content: Portfolio (P3.4) */}
      {activeTab === "portfolio" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-card-foreground">Portfolio</h2>
              <Badge variant="outline" size="sm">{mockPortfolioItems.length} items</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {mockPortfolioItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-muted transition-all hover:ring-2 hover:ring-primary/40"
                  aria-label={`View ${item.title}`}
                >
                  {item.mediaType === "image" ? (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      {item.mediaType === "video" ? (
                        <Play className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <Music className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium text-white truncate">{item.title}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      {item.mediaType === "image" && <ImageIcon className="h-3 w-3 text-white/60" />}
                      {item.mediaType === "video" && <Play className="h-3 w-3 text-white/60" />}
                      {item.mediaType === "audio" && <Music className="h-3 w-3 text-white/60" />}
                      <span className="text-[10px] text-white/60 capitalize">{item.mediaType}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <AiContentValidator contentId={creator.id} contentType="portfolio" />
          <PortfolioLightbox
            items={mockPortfolioItems}
            initialIndex={lightboxIndex}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        </div>
      )}

      {/* Tab Content: Collaborations */}
      {activeTab === "collaborations" && (
        <div className="space-y-3">
          {mockCollabs.map((collab) => (
            <div key={collab.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card">
              <div>
                <p className="text-sm font-semibold text-card-foreground">{collab.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">with {collab.partner} &middot; {collab.role}</p>
              </div>
              <Badge variant={collab.status === "active" ? "success" : "outline"} size="sm">
                {collab.status}
              </Badge>
            </div>
          ))}
          {mockCollabs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-semibold text-muted-foreground">No collaborations yet</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Reviews (P3.7) */}
      {activeTab === "reviews" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <ProfileReviews creatorName={creator.name} />
        </div>
      )}
    </div>
  );
}
