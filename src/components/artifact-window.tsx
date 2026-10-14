import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

function ArtifactWindow({
  title,
  kind,
  actions,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  title: ReactNode;
  kind: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      data-slot="artifact-window"
      className={cn("flex min-h-0 flex-1 flex-col bg-ka-surface", className)}
      {...props}
    >
      <div
        data-slot="artifact-window-header"
        className="flex min-h-8 items-center gap-2 border-b border-ka-line bg-ka-surface px-2.5 py-1.5"
      >
        <span
          data-slot="artifact-window-title"
          className="font-mono text-[10px] tracking-wider text-ka-ink uppercase"
        >
          {title}
        </span>
        <span
          data-slot="artifact-window-pipe"
          className="font-mono text-[10px] tracking-wider text-ka-faint"
          aria-hidden="true"
        >
          |
        </span>
        <span
          data-slot="artifact-window-kind"
          className="font-mono text-[10px] tracking-wider text-ka-faint uppercase"
        >
          {kind}
        </span>
        {actions != null && actions !== false ? (
          <div
            data-slot="artifact-window-actions"
            className="ml-auto flex shrink-0 items-center gap-1.5"
          >
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ArtifactWindowBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="artifact-window-body"
      className={cn("min-h-0 min-w-0 flex-1", className)}
      {...props}
    />
  );
}

export { ArtifactWindow, ArtifactWindowBody };
