import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

function WorkSplit({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="work-split"
      className={cn(
        "flex flex-col overflow-hidden rounded-ka-card border border-ka-line bg-ka-surface md:flex-row",
        className,
      )}
      {...props}
    />
  );
}

function WorkSplitPane({
  side,
  className,
  ...props
}: ComponentProps<"div"> & {
  side: "thread" | "artifact";
}) {
  return (
    <div
      data-slot="work-split-pane"
      data-side={side}
      className={cn(
        "min-w-0",
        side === "thread" &&
          "border-b border-ka-line md:w-[34%] md:shrink-0 md:border-r md:border-b-0",
        side === "artifact" && "flex min-h-0 flex-1 flex-col",
        className,
      )}
      {...props}
    />
  );
}

export { WorkSplit, WorkSplitPane };
