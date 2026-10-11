import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const statusDotVariants = cva("relative z-10 rounded-full", {
  variants: {
    variant: {
      default: "bg-ka-accent",
      success: "bg-emerald-500",
      danger: "bg-destructive",
      neutral: "bg-ka-faint",
    },
    size: {
      sm: "size-1",
      default: "size-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const statusDotPingVariants = cva("absolute inset-[-3px] animate-ping rounded-full opacity-40", {
  variants: {
    variant: {
      default: "bg-ka-accent",
      success: "bg-emerald-500",
      danger: "bg-destructive",
      neutral: "bg-ka-faint",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const STATUS_DOT_LABELS = {
  default: "Status: active",
  success: "Status: success",
  danger: "Status: alert",
  neutral: "Status: idle",
} as const;

function StatusDot({
  className,
  variant = "default",
  size = "default",
  pulse = false,
  role = "status",
  "aria-label": ariaLabel,
  ...props
}: ComponentProps<"span"> &
  VariantProps<typeof statusDotVariants> & {
    pulse?: boolean;
  }) {
  const resolvedVariant = variant ?? "default";

  return (
    <span
      data-slot="status-dot"
      data-variant={resolvedVariant}
      data-size={size}
      data-pulse={pulse || undefined}
      role={role}
      aria-label={ariaLabel ?? STATUS_DOT_LABELS[resolvedVariant]}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        size === "sm" ? "size-2.5" : "size-3",
        className,
      )}
      {...props}
    >
      {pulse ? (
        <span aria-hidden className={statusDotPingVariants({ variant: resolvedVariant })} />
      ) : null}
      <span aria-hidden className={statusDotVariants({ variant: resolvedVariant, size })} />
    </span>
  );
}

export { StatusDot, statusDotVariants };
