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

function formatStep(step: string | number): string {
  if (typeof step === "number" && Number.isFinite(step)) {
    return Math.abs(Math.trunc(step)).toString().padStart(2, "0");
  }
  return String(step);
}

function StepCard({
  step,
  title,
  description,
  badge,
  visual,
  className,
  role = "listitem",
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  step: string | number;
  title: ReactNode;
  description: ReactNode;
  badge?: ReactNode;
  visual?: ReactNode;
}) {
  return (
    <div
      data-slot="step-card"
      role={role}
      className={cn(
        "flex h-full min-w-0 flex-col gap-2 rounded-ka-card border border-ka-line bg-ka-surface p-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          data-slot="step-card-index"
          className="font-mono text-xs tracking-widest text-ka-faint uppercase"
        >
          {formatStep(step)}
        </span>
        {badge != null && badge !== false ? (
          typeof badge === "string" || typeof badge === "number" ? (
            <span
              data-slot="step-card-badge"
              className="shrink-0 rounded-ka-pill border border-ka-line px-1.5 py-px font-mono text-[10px] font-medium tracking-wider text-ka-muted uppercase"
            >
              {badge}
            </span>
          ) : (
            <span data-slot="step-card-badge" className="shrink-0">
              {badge}
            </span>
          )
        ) : null}
      </div>
      <div data-slot="step-card-title" className="text-sm font-semibold text-ka-ink">
        {title}
      </div>
      <div
        data-slot="step-card-description"
        className="text-xs leading-snug text-ka-muted"
      >
        {description}
      </div>
      {visual != null && visual !== false ? (
        <div data-slot="step-card-visual" className="mt-auto min-w-0">
          {visual}
        </div>
      ) : null}
    </div>
  );
}

function StepGrid({
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
      data-slot="step-grid"
      data-cols={typeof cols === "number" ? cols : undefined}
      role={role}
      className={cn("grid gap-3", colClass, className)}
      {...props}
    />
  );
}

export { StepCard, StepGrid };
