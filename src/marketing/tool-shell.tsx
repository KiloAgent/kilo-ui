import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { cardClass } from "./card";

export function ToolPage({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn("relative z-10 min-w-0 flex-1 overflow-x-clip bg-ka-bg pb-10", className)}
      {...rest}
    >
      {children}
    </main>
  );
}

export function ToolContainer({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full min-w-0 max-w-3xl px-5 lg:px-8", className)}>{children}</div>
  );
}

export function ToolTitle({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "mb-3 font-ka-sans text-ka-h1 font-semibold tracking-tight text-balance text-ka-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function ToolCard({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cardClass("md", false, cn("mb-6 p-5 sm:p-6 md:p-8", className))} {...rest}>
      {children}
    </div>
  );
}

export function ToolStepTitle({
  className,
  children,
  ...rest
}: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "ka-focus-quiet mb-4 font-ka-sans text-ka-h3 font-semibold tracking-tight text-ka-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </h2>
  );
}

/** Shared utility classes used by multiple tool views (keeps DRY check green). */
export const TOOL_STATUS_CLASS =
  "mb-3 hidden px-1 text-left font-ka-mono text-ka-label text-ka-muted";
export const TOOL_PRE_CLASS =
  "break-words font-ka-mono text-sm leading-relaxed whitespace-pre-wrap text-ka-ink";

export const TOOL_HIDDEN_STATUS_CLASS = "hidden text-ka-muted text-sm text-left px-1 mb-3";
export const TOOL_PRIMARY_BTN_CLASS =
  "w-full px-8 py-4 rounded-ka-button bg-ka-ink text-white font-semibold hover:bg-ka-accent transition-colors";
export const TOOL_SECONDARY_BTN_CLASS =
  "shrink-0 px-4 py-2 rounded-ka-button border border-ka-line-strong text-ka-ink text-sm hover:bg-ka-subtle transition-colors";
export const TOOL_PRE_BODY_CLASS =
  "whitespace-pre-wrap break-words text-ka-ink text-sm leading-relaxed font-sans";
export const TOOL_CONSENT_ROW_CLASS =
  "flex items-start gap-3 text-left text-sm text-ka-muted px-1 mt-4 mb-6";
export const TOOL_RESULT_PANEL_CLASS =
  "rounded-ka-card border border-ka-line bg-ka-surface p-4 sm:p-5";
