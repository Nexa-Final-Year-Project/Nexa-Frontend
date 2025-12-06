import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-neutral-200 dark:bg-white/[0.06] animate-pulse rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
