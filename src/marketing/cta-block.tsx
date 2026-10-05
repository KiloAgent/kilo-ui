import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { cardClass } from "./card";

export function CtaBlock({
  heading,
  headingId,
  body,
  bodyId,
  bodyHidden = false,
  className,
  children,
}: {
  heading: string;
  headingId?: string;
  body?: string;
  bodyId?: string;
  bodyHidden?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cardClass("lg", false, cn("overflow-hidden text-center", className))}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ka-accent"
        aria-hidden="true"
      />
      <h2 id={headingId} className="text-ka-h2 font-semibold tracking-tight text-ka-ink">
        {heading}
      </h2>
      {body ? (
        <p
          id={bodyId}
          className={cn(
            "mx-auto mt-3 max-w-xl text-ka-lead text-ka-muted text-balance",
            bodyHidden && "hidden",
          )}
        >
          {body}
        </p>
      ) : null}
      {children}
    </div>
  );
}
