import { Skeleton, SkeletonText } from "@blox-ui/ui";

export default function SkeletonExample() {
  return (
    <div className="flex w-full max-w-xs items-start gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-32" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}
