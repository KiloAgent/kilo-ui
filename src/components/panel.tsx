import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="panel"
      className={cn(
        "flex flex-col overflow-hidden rounded-ka-card border border-ka-line bg-ka-surface text-sm text-ka-ink",
        className,
      )}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "flex min-h-8 items-center gap-2 border-b border-ka-line bg-ka-surface px-2.5 py-1.5",
        className,
      )}
      {...props}
    />
  );
}

function PanelTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-title"
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 font-mono text-[10px] font-medium tracking-wider text-ka-ink uppercase",
        className,
      )}
      {...props}
    />
  );
}

function PanelActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="panel-content" className={cn("min-h-0 flex-1 p-0", className)} {...props} />
  );
}

function PanelFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-footer"
      className={cn(
        "flex min-h-7 items-center gap-2 border-t border-ka-line bg-ka-subtle/70 px-2.5 py-1 font-mono text-[10px] tracking-wider text-ka-faint uppercase",
        className,
      )}
      {...props}
    />
  );
}

export { Panel, PanelHeader, PanelTitle, PanelActions, PanelContent, PanelFooter };
