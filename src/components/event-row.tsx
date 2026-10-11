import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../lib/cn";

function EventRow({
  timestamp,
  badge,
  tag,
  indicator,
  message,
  meta,
  className,
  role = "listitem",
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  timestamp: string;
  badge?: ReactNode;
  tag?: ReactNode;
  indicator?: ReactNode;
  message: ReactNode;
  meta?: ReactNode;
}) {
  const chip = badge ?? tag;

  return (
    <div
      data-slot="event-row"
      role={role}
      className={cn(
        "flex min-h-7 items-center gap-2 border-b border-ka-line px-2.5 hover:bg-ka-subtle/70",
        className,
      )}
      {...props}
    >
      {indicator}
      <time
        data-slot="event-row-timestamp"
        className="shrink-0 font-mono text-[10px] text-ka-faint tabular-nums"
      >
        {timestamp}
      </time>
      {chip != null && chip !== false ? (
        typeof chip === "string" || typeof chip === "number" ? (
          <span
            data-slot="event-row-badge"
            className="shrink-0 font-mono text-[10px] font-medium tracking-wider text-ka-muted uppercase"
          >
            {chip}
          </span>
        ) : (
          <span data-slot="event-row-badge" className="shrink-0">
            {chip}
          </span>
        )
      ) : null}
      <div data-slot="event-row-message" className="min-w-0 flex-1 truncate text-xs text-ka-ink">
        {message}
      </div>
      {meta != null && meta !== false ? (
        <div
          data-slot="event-row-meta"
          className="ml-auto shrink-0 font-mono text-[10px] text-ka-faint tabular-nums"
        >
          {meta}
        </div>
      ) : null}
    </div>
  );
}

function EventFeed({
  className,
  maxHeight,
  style,
  role = "list",
  ...props
}: ComponentProps<"div"> & {
  maxHeight?: number | string;
}) {
  const mergedStyle: CSSProperties | undefined =
    maxHeight == null && style == null
      ? style
      : {
          ...style,
          ...(maxHeight != null
            ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
            : null),
        };

  return (
    <div
      data-slot="event-feed"
      role={role}
      style={mergedStyle}
      className={cn(
        "overflow-y-auto border border-ka-line bg-ka-surface [&>[data-slot=event-row]:last-child]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export { EventRow, EventFeed };
