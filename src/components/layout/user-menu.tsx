"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Settings, LogOut, CreditCard, HelpCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/supabase/auth-context";

interface UserMenuProps {
  onClose: () => void;
}

const menuItems = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export function UserMenu({ onClose }: UserMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayUsername = user?.user_metadata?.username || user?.email?.split("@")[0] || "user";

  async function handleSignOut() {
    await signOut();
    onClose();
    router.push("/login");
    router.refresh();
  }

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
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card shadow-xl"
      role="menu"
      aria-label="User menu"
    >
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Avatar alt={displayName} size="md" status="online" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-card-foreground truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">@{displayUsername}</p>
        </div>
      </div>
      <div className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            role="menuitem"
            onClick={onClose}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-border p-2">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary-rose hover:bg-secondary-rose/5 transition-colors"
          role="menuitem"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}
