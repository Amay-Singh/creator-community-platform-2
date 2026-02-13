"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeMessagesOptions {
  conversationId: string | null;
  onNewMessage: (message: Record<string, unknown>) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function useRealtimeMessages({ conversationId, onNewMessage, onDeleteMessage }: UseRealtimeMessagesOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();

    channelRef.current = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Record<string, unknown>);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (onDeleteMessage) {
            onDeleteMessage((payload.old as Record<string, unknown>).id as string);
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, onNewMessage, onDeleteMessage]);
}

interface UsePresenceOptions {
  channelName: string;
  userId: string | null;
  onSync: (presenceState: Record<string, unknown[]>) => void;
}

export function usePresence({ channelName, userId, onSync }: UsePresenceOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    channelRef.current = supabase.channel(channelName, {
      config: { presence: { key: userId } },
    });

    channelRef.current
      .on("presence", { event: "sync" }, () => {
        const state = channelRef.current?.presenceState() ?? {};
        onSync(state as Record<string, unknown[]>);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && channelRef.current) {
          await channelRef.current.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [channelName, userId, onSync]);
}

export function useRealtimeReactions({
  conversationId,
  onReactionChange,
}: {
  conversationId: string | null;
  onReactionChange: () => void;
}) {
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`reactions:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        () => {
          onReactionChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onReactionChange]);
}
