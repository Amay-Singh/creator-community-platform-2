"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

interface CreatorCardProps {
  creator: User;
  view?: "grid" | "list";
  isAiRecommended?: boolean;
}

export function CreatorCard({ creator, view = "grid", isAiRecommended }: CreatorCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [collabSent, setCollabSent] = useState(false);
  const { user } = useAuth();

  async function handleFollow() {
    if (!user) return;
    setFollowLoading(true);
    const supabase = createClient();
    if (isFollowing) {
      await supabase.from("followers").delete().match({ follower_id: user.id, following_id: creator.id });
      setIsFollowing(false);
    } else {
      await supabase.from("followers").insert({ follower_id: user.id, following_id: creator.id });
      setIsFollowing(true);
    }
    setFollowLoading(false);
  }

  async function handleCollaborate() {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("collaborations")
      .insert({ title: `Collab with ${creator.name}`, description: `Collaboration invite from ${user.user_metadata?.full_name || "a creator"}`, owner_id: user.id })
      .select()
      .single();
    if (data) {
      await supabase.from("collaboration_members").insert([
        { collaboration_id: data.id, user_id: user.id, role: "owner", status: "accepted" },
        { collaboration_id: data.id, user_id: creator.id, role: "member", status: "pending" },
      ]);
      setCollabSent(true);
    }
  }

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover">
        <Avatar alt={creator.name} src={creator.avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${creator.username}`}
              className="text-sm font-semibold text-card-foreground hover:text-primary transition-colors truncate"
            >
              {creator.name}
            </Link>
            {isAiRecommended && (
              <div className="flex h-4 items-center gap-0.5 rounded-full bg-primary/10 px-1.5">
                <Sparkles className="h-2.5 w-2.5 text-primary" aria-hidden="true" />
                <span className="text-[9px] font-bold text-primary">AI</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">@{creator.username}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">{creator.category}</Badge>
            {creator.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {creator.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-center">
          <div>
            <p className="text-sm font-bold text-card-foreground">{creator.followers.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-card-foreground">{creator.collaborations}</p>
            <p className="text-[10px] text-muted-foreground">Collabs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={isFollowing ? "outline" : "gradient"} size="sm" onClick={handleFollow} isLoading={followLoading}>
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCollaborate} disabled={collabSent}>
            {collabSent ? "Sent" : "Collaborate"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar alt={creator.name} src={creator.avatar} size="lg" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile/${creator.username}`}
                className="text-sm font-semibold text-card-foreground hover:text-primary transition-colors truncate"
              >
                {creator.name}
              </Link>
              {isAiRecommended && (
                <div className="flex h-4 items-center gap-0.5 rounded-full bg-primary/10 px-1.5">
                  <Sparkles className="h-2.5 w-2.5 text-primary" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{creator.username}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="primary" size="sm">{creator.category}</Badge>
        {creator.location && (
          <Badge variant="outline" size="sm">
            <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
            {creator.location}
          </Badge>
        )}
      </div>

      {creator.bio && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {creator.bio}
        </p>
      )}

      {creator.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {creator.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
          ))}
          {creator.skills.length > 3 && (
            <Badge variant="outline" size="sm">+{creator.skills.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-center">
        <div>
          <p className="text-sm font-bold text-card-foreground">{creator.followers.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Followers</p>
        </div>
        <div>
          <p className="text-sm font-bold text-card-foreground">{creator.collaborations}</p>
          <p className="text-[10px] text-muted-foreground">Collabs</p>
        </div>
        <div>
          <p className="text-sm font-bold text-card-foreground">{creator.profileHealth}%</p>
          <p className="text-[10px] text-muted-foreground">Health</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant={isFollowing ? "outline" : "gradient"} size="sm" className="flex-1" onClick={handleFollow} isLoading={followLoading}>
          {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleCollaborate} disabled={collabSent}>
          {collabSent ? "Invite Sent" : "Collaborate"}
        </Button>
      </div>
    </div>
  );
}
