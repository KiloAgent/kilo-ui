import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Small mono eyebrow chip. One size site-wide. */
export function Badge({
  dot = false,
  className,
  children,
}: {
  dot?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-ka-pill border border-ka-line bg-ka-surface px-1.5 py-0.5 font-ka-mono text-ka-label uppercase tracking-[0.1em] text-ka-muted",
        className,
      )}
    >
      {dot ? (
        <span className="size-1 shrink-0 rounded-none bg-ka-accent" aria-hidden="true" />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
