export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-shimmer rounded-md ${className}`} />
);

export const VehicleCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
    <Skeleton className="h-40 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-2 w-full" />
      <div className="mt-1 flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);
