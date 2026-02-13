import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="mt-3 h-4 w-28" />
              <Skeleton className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
              <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
              <Skeleton className="mt-2 h-3 w-full" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
