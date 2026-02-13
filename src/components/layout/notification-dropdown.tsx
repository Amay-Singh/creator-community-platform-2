"use client";

import { useEffect, useRef } from "react";
import { Users, MessageSquare, Bell, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: "1",
    type: "collab_invite" as const,
    title: "New collaboration invite",
    body: "Maya Chen invited you to collaborate on 'Urban Beats'",
    read: false,
    createdAt: "2m ago",
  },
  {
    id: "2",
    type: "follow" as const,
    title: "New follower",
    body: "Alex Rivera started following you",
    read: false,
    createdAt: "15m ago",
  },
  {
    id: "3",
    type: "message" as const,
    title: "New message",
    body: "Jordan Lee: Hey, let's discuss the project timeline",
    read: false,
    createdAt: "1h ago",
  },
  {
    id: "4",
    type: "system" as const,
    title: "Profile boost",
    body: "Your profile health increased to 85%. Keep it up!",
    read: true,
    createdAt: "3h ago",
  },
];

const typeIcons = {
  collab_invite: Users,
  follow: UserPlus,
  message: MessageSquare,
  system: Bell,
};

const typeColors = {
  collab_invite: "text-primary bg-primary/10",
  follow: "text-secondary-purple bg-secondary-purple/10",
  message: "text-secondary-emerald bg-secondary-emerald/10",
  system: "text-secondary-orange bg-secondary-orange/10",
};

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-xl"
      role="menu"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
        <button className="text-xs font-medium text-primary hover:underline">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {mockNotifications.map((notification) => {
          const Icon = typeIcons[notification.type];
          return (
            <button
              key={notification.id}
              className={cn(
                "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                !notification.read && "bg-primary/[0.02]"
              )}
              role="menuitem"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  typeColors[notification.type]
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {notification.body}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">{notification.createdAt}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="border-t border-border p-3">
        <button className="w-full rounded-lg py-2 text-center text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}
