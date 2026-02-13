"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Collaboration = Database["public"]["Tables"]["collaborations"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];

export function useCurrentUser() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setIsLoading(false);
    }

    fetchProfile();
  }, []);

  return { profile, isLoading };
}

export function useProfile(username: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const supabase = createClient();
    const usernameVal = username;

    async function fetchProfile() {
      const { data, error: err } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", usernameVal)
        .single();

      if (err) setError(err.message);
      setProfile(data);
      setIsLoading(false);
    }

    fetchProfile();
  }, [username]);

  return { profile, isLoading, error };
}

export function useProfiles(filters?: { skill?: string; location?: string; search?: string }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(50);

    if (filters?.skill) {
      query = query.contains("skills", [filters.skill]);
    }
    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
      );
    }

    const { data, count } = await query;
    setProfiles(data || []);
    setTotal(count || 0);
    setIsLoading(false);
  }, [filters?.skill, filters?.location, filters?.search]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, isLoading, total, refetch: fetchProfiles };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const json = await res.json();
      setConversations(json.data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, isLoading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    const res = await fetch(`/api/messages?conversation_id=${conversationId}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data || []);
    }
    setIsLoading(false);
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!conversationId) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversationId, text }),
    });
    if (res.ok) {
      const json = await res.json();
      setMessages((prev) => [...prev, json.data]);
    }
  }, [conversationId]);

  const addMessage = useCallback((msg: Record<string, unknown>) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  return { messages, isLoading, sendMessage, addMessage, refetch: fetchMessages };
}

export function useCollaborations(status?: string) {
  const [collaborations, setCollaborations] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      const url = status ? `/api/collaborations?status=${status}` : "/api/collaborations";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setCollaborations(json.data || []);
      }
      setIsLoading(false);
    }

    fetch_();
  }, [status]);

  return { collaborations, isLoading };
}

export function useCollaboration(id: string | null) {
  const [collaboration, setCollaboration] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetch_() {
      const res = await fetch(`/api/collaborations/${id}`);
      if (res.ok) {
        const json = await res.json();
        setCollaboration(json.data);
      }
      setIsLoading(false);
    }

    fetch_();
  }, [id]);

  return { collaboration, isLoading };
}

export function useReviews(revieweeId: string | null) {
  const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!revieweeId) return;

    async function fetch_() {
      const res = await fetch(`/api/reviews?reviewee_id=${revieweeId}`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.data || []);
      }
      setIsLoading(false);
    }

    fetch_();
  }, [revieweeId]);

  return { reviews, isLoading };
}
