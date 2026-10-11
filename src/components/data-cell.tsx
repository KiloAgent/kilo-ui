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

type DataCellSize = "default" | "sm";

function DataCell({
  label,
  value,
  hint,
  subvalue,
  indicator,
  size = "default",
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  subvalue?: ReactNode;
  indicator?: ReactNode;
  size?: DataCellSize;
}) {
  const secondary = hint ?? subvalue;

  return (
    <div
      data-slot="data-cell"
      data-size={size}
      className={cn(
        "flex min-w-0 flex-col justify-center bg-ka-surface",
        size === "sm" ? "gap-0.5 px-2 py-1.5" : "gap-1 px-2.5 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {indicator}
        <span
          data-slot="data-cell-label"
          className="truncate font-mono text-[10px] tracking-wider text-ka-faint uppercase"
        >
          {label}
        </span>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span
          data-slot="data-cell-value"
          className={cn(
            "min-w-0 truncate font-mono font-medium text-ka-ink tabular-nums",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {value}
        </span>
        {secondary != null && secondary !== false ? (
          <span
            data-slot="data-cell-hint"
            className="truncate font-mono text-[10px] text-ka-faint tabular-nums"
          >
            {secondary}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function DataGrid({
  cols = 3,
  className,
  ...props
}: ComponentProps<"div"> & {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | (string & {});
}) {
  const colClass = typeof cols === "number" ? (GRID_COLS[cols] ?? GRID_COLS[3]) : cols;

  return (
    <div
      data-slot="data-grid"
      data-cols={typeof cols === "number" ? cols : undefined}
      className={cn(
        "grid gap-px overflow-hidden rounded-ka-card border border-ka-line bg-ka-line",
        colClass,
        className,
      )}
      {...props}
    />
  );
}

export { DataCell, DataGrid };
