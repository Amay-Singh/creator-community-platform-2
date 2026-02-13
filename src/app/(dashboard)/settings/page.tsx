"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, Palette, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type SettingsTab = "profile" | "notifications" | "privacy" | "billing" | "appearance" | "language";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
];

function ToggleSwitch({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          enabled && "translate-x-5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [collabNotifs, setCollabNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1" aria-label="Settings navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Profile Photo</h3>
                <div className="flex items-center gap-4">
                  <Avatar alt="User" size="xl" />
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
                <h3 className="text-sm font-semibold text-card-foreground">Personal Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue="Creator Name" />
                  <Input label="Username" defaultValue="username" />
                </div>
                <Input label="Email" type="email" defaultValue="creator@example.com" />
                <Input label="Bio" defaultValue="Creative professional" />
                <Input label="Location" defaultValue="Los Angeles, CA" />
                <Button variant="gradient" size="sm">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4 divide-y divide-border">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <ToggleSwitch enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} label="Email notifications" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Browser push notifications</p>
                  </div>
                  <ToggleSwitch enabled={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} label="Push notifications" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Collaboration Invites</p>
                    <p className="text-xs text-muted-foreground">Get notified about new invites</p>
                  </div>
                  <ToggleSwitch enabled={collabNotifs} onToggle={() => setCollabNotifs(!collabNotifs)} label="Collaboration notifications" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Messages</p>
                    <p className="text-xs text-muted-foreground">Notify for new messages</p>
                  </div>
                  <ToggleSwitch enabled={messageNotifs} onToggle={() => setMessageNotifs(!messageNotifs)} label="Message notifications" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Privacy</h3>
                <div className="space-y-4 divide-y divide-border">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Public Profile</p>
                      <p className="text-xs text-muted-foreground">Make your profile visible to everyone</p>
                    </div>
                    <ToggleSwitch enabled={profilePublic} onToggle={() => setProfilePublic(!profilePublic)} label="Public profile" />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Show Activity</p>
                      <p className="text-xs text-muted-foreground">Display your activity in the feed</p>
                    </div>
                    <ToggleSwitch enabled={showActivity} onToggle={() => setShowActivity(!showActivity)} label="Show activity" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="text-sm font-semibold text-card-foreground mb-4">Security</h3>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <ToggleSwitch enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} label="Two-factor authentication" />
                </div>
                <Button variant="outline" size="sm" className="mt-4">Change Password</Button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">Current Plan</h3>
                    <p className="mt-1 text-xs text-muted-foreground">You are on the free plan</p>
                  </div>
                  <Badge variant="outline" size="md">Free</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <h4 className="text-lg font-bold text-card-foreground">Creator Pro</h4>
                  <p className="mt-1 text-sm text-muted-foreground">For serious creators</p>
                  <p className="mt-4 text-3xl font-bold text-foreground">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">✓ Unlimited AI generations</li>
                    <li className="flex items-center gap-2">✓ Priority search placement</li>
                    <li className="flex items-center gap-2">✓ Advanced analytics</li>
                    <li className="flex items-center gap-2">✓ Custom profile themes</li>
                  </ul>
                  <Button variant="gradient" className="mt-6 w-full">Upgrade</Button>
                </div>
                <div className="rounded-2xl border-2 border-primary bg-card p-6 shadow-card relative">
                  <Badge variant="primary" size="sm" className="absolute -top-2 right-4">Popular</Badge>
                  <h4 className="text-lg font-bold text-card-foreground">Creator Team</h4>
                  <p className="mt-1 text-sm text-muted-foreground">For teams & agencies</p>
                  <p className="mt-4 text-3xl font-bold text-foreground">$24.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">✓ Everything in Pro</li>
                    <li className="flex items-center gap-2">✓ Team collaboration tools</li>
                    <li className="flex items-center gap-2">✓ Revenue dashboard</li>
                    <li className="flex items-center gap-2">✓ Priority support</li>
                  </ul>
                  <Button variant="gradient" className="mt-6 w-full">Upgrade</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Appearance</h3>
              <p className="text-xs text-muted-foreground mb-4">Customize how Colab looks for you</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-primary bg-white p-4 text-xs font-medium text-gray-900">
                  <div className="h-8 w-8 rounded-lg bg-gray-100" />
                  Light
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border border-border bg-gray-900 p-4 text-xs font-medium text-white">
                  <div className="h-8 w-8 rounded-lg bg-gray-700" />
                  Dark
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-xs font-medium text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white to-gray-900" />
                  System
                </button>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Language & Region</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Language</label>
                  <select className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                    <option>Deutsch</option>
                    <option>日本語</option>
                    <option>한국어</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Timezone</label>
                  <select className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central European Time (CET)</option>
                    <option>Japan Standard Time (JST)</option>
                  </select>
                </div>
                <Button variant="gradient" size="sm">Save</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
