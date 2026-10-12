import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

function SpecRow({
  label,
  value,
  unit,
  hint,
  className,
  role = "listitem",
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div
      data-slot="spec-row"
      role={role}
      className={cn(
        "flex min-h-8 min-w-0 items-center justify-between gap-4 px-2.5 py-2",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <div data-slot="spec-row-label" className="truncate text-xs text-ka-muted">
          {label}
        </div>
        {hint != null && hint !== false ? (
          <div
            data-slot="spec-row-hint"
            className="mt-0.5 truncate font-mono text-[10px] text-ka-faint"
          >
            {hint}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-baseline gap-1.5">
        <span
          data-slot="spec-row-value"
          className="font-mono text-sm font-medium text-ka-ink tabular-nums"
        >
          {value}
        </span>
        {unit != null && unit !== false ? (
          typeof unit === "string" || typeof unit === "number" ? (
            <span
              data-slot="spec-row-unit"
              className="rounded-ka-pill border border-ka-line px-1.5 py-px font-mono text-[10px] tracking-wider text-ka-faint uppercase"
            >
              {unit}
            </span>
          ) : (
            <span data-slot="spec-row-unit" className="shrink-0">
              {unit}
            </span>
          )
        ) : null}
      </div>
    </div>
  );
}

function SpecMatrix({ className, role = "list", ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="spec-matrix"
      role={role}
      className={cn(
        "divide-y divide-ka-line overflow-hidden rounded-ka-card border border-ka-line bg-ka-surface",
        className,
      )}
      {...props}
    />
  );
}

export { SpecRow, SpecMatrix };
