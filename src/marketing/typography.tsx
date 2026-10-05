import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

type Props = { className?: string; children?: ReactNode } & HTMLAttributes<HTMLElement>;

export function Display({ className, children, ...rest }: Props) {
  return (
    <h1
      className={cn(
        "font-ka-sans text-ka-display font-semibold tracking-tight text-balance text-ka-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H1({ className, children, ...rest }: Props) {
  return (
    <h1
      className={cn(
        "font-ka-sans text-ka-h1 font-semibold tracking-tight text-balance text-ka-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...rest }: Props) {
  return (
    <h2
      className={cn("font-ka-sans text-ka-h2 font-semibold tracking-tight text-ka-ink", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...rest }: Props) {
  return (
    <h3
      className={cn("font-ka-sans text-ka-h3 font-semibold tracking-tight text-ka-ink", className)}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function Lead({ className, children, ...rest }: Props) {
  return (
    <p className={cn("text-ka-lead text-ka-muted text-balance", className)} {...rest}>
      {children}
    </p>
  );
}

export function Body({ className, children, ...rest }: Props) {
  return (
    <p className={cn("text-ka-body text-ka-ink leading-relaxed", className)} {...rest}>
      {children}
    </p>
  );
}

export function Small({ className, children, ...rest }: Props) {
  return (
    <p className={cn("text-ka-small text-ka-muted", className)} {...rest}>
      {children}
    </p>
  );
}

/** Mono eyebrow / table / code label. */
export function MonoLabel({ className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "font-ka-mono text-ka-label uppercase tracking-[0.1em] text-ka-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
