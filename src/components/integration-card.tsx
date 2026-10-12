import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

const GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
} as const;

function IntegrationCard({
  icon,
  name,
  status,
  description,
  badge,
  action,
  className,
  role = "listitem",
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  icon?: ReactNode;
  name: ReactNode;
  status?: ReactNode;
  description: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      data-slot="integration-card"
      role={role}
      className={cn(
        "flex h-full min-w-0 flex-col gap-2.5 rounded-ka-card border border-ka-line bg-ka-surface p-3 transition-colors hover:bg-ka-subtle/40",
        className,
      )}
      {...props}
    >
      <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-2.5">
        {icon != null && icon !== false ? (
          <span
            data-slot="integration-card-icon"
            className="flex size-8 shrink-0 self-start items-center justify-center rounded-ka-card border border-ka-line bg-ka-subtle/50 text-ka-ink [&_svg]:size-4"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                data-slot="integration-card-name"
                className="truncate text-sm font-medium text-ka-ink"
              >
                {name}
              </div>
              {status != null && status !== false ? (
                typeof status === "string" || typeof status === "number" ? (
                  <span
                    data-slot="integration-card-status"
                    className="mt-0.5 block font-mono text-[10px] tracking-wider text-ka-faint uppercase"
                  >
                    {status}
                  </span>
                ) : (
                  <span data-slot="integration-card-status" className="mt-0.5 block">
                    {status}
                  </span>
                )
              ) : null}
            </div>
            {badge != null && badge !== false ? (
              typeof badge === "string" || typeof badge === "number" ? (
                <span
                  data-slot="integration-card-badge"
                  className="shrink-0 rounded-ka-pill border border-ka-line px-1.5 py-px font-mono text-[10px] font-medium tracking-wider text-ka-muted uppercase"
                >
                  {badge}
                </span>
              ) : (
                <span data-slot="integration-card-badge" className="shrink-0">
                  {badge}
                </span>
              )
            ) : null}
          </div>
          <div
            data-slot="integration-card-description"
            className="text-xs leading-snug text-ka-muted"
          >
            {description}
          </div>
          {action != null && action !== false ? (
            <div
              data-slot="integration-card-action"
              className="mt-auto flex items-center pt-0.5"
            >
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IntegrationGrid({
  cols = 3,
  className,
  role = "list",
  ...props
}: ComponentProps<"div"> & {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | (string & {});
}) {
  const colClass = typeof cols === "number" ? (GRID_COLS[cols] ?? GRID_COLS[3]) : cols;

  return (
    <div
      data-slot="integration-grid"
      data-cols={typeof cols === "number" ? cols : undefined}
      role={role}
      className={cn("grid gap-3", colClass, className)}
      {...props}
    />
  );
}

export { IntegrationCard, IntegrationGrid };
