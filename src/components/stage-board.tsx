import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

function StageBoard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stage-board"
      className={cn("flex min-w-0 gap-2 overflow-x-auto", className)}
      {...props}
    />
  );
}

function StageColumn({
  label,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  label: ReactNode;
}) {
  return (
    <div
      data-slot="stage-column"
      className={cn("flex min-w-36 flex-1 flex-col gap-1.5", className)}
      {...props}
    >
      <div
        data-slot="stage-column-label"
        className="font-mono text-[10px] tracking-wider text-ka-faint uppercase"
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function StageCard({
  name,
  meta,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  name: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div
      data-slot="stage-card"
      className={cn(
        "rounded-ka-card border border-ka-line bg-ka-surface px-2 py-1.5",
        className,
      )}
      {...props}
    >
      <div data-slot="stage-card-name" className="truncate text-xs text-ka-ink">
        {name}
      </div>
      {meta != null && meta !== false ? (
        <div
          data-slot="stage-card-meta"
          className="mt-0.5 truncate font-mono text-[10px] text-ka-faint"
        >
          {meta}
        </div>
      ) : null}
    </div>
  );
}

export { StageBoard, StageColumn, StageCard };
