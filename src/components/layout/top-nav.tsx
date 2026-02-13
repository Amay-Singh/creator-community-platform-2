"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { NotificationDropdown } from "./notification-dropdown";
import { UserMenu } from "./user-menu";

export function TopNav() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 z-40 flex h-16 w-full items-center border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="text-2xl font-bold gradient-text shrink-0" aria-label="Colab Dashboard">
          Colab
        </Link>

        {/* Search Bar */}
        <div className="mx-4 flex max-w-md flex-1 sm:mx-8">
          <div
            className={cn(
              "flex w-full items-center gap-2 rounded-xl border bg-background px-3 py-2 transition-all duration-200",
              searchFocused
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/30"
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search creators, projects..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search creators and projects"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-rose text-[10px] font-bold text-white">
                3
              </span>
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted transition-colors"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <Avatar alt="User" size="sm" status="online" />
            </button>
            {showUserMenu && (
              <UserMenu onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
