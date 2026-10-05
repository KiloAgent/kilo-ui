import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Long-form marketing / legal copy on the dense technical theme. */
export function Prose({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-none text-ka-body text-ka-ink leading-relaxed",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-ka-sans [&_h2]:text-ka-h2 [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ka-ink",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-ka-sans [&_h3]:text-ka-h3 [&_h3]:font-semibold [&_h3]:text-ka-ink",
        "[&_p]:mt-4 [&_p]:text-ka-body [&_p]:text-ka-ink",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ka-ink",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-ka-ink",
        "[&_li]:mt-1.5",
        "[&_a]:text-ka-ink [&_a]:underline [&_a]:decoration-ka-accent [&_a]:underline-offset-4 hover:[&_a]:text-ka-ink-soft",
        "[&_strong]:font-semibold [&_strong]:text-ka-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
