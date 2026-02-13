import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiSuggestions } from "@/components/dashboard/ai-suggestions";
import { AdBanner } from "@/components/ads/ad-banner";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening in your creative world.
        </p>
      </div>

      <StatsOverview />
      <QuickActions />
      <AiSuggestions />
      <AdBanner variant="banner" />
      <ActivityFeed />
    </div>
  );
}
