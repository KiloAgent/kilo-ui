import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-ka-button font-ka-sans font-medium tracking-[-0.01em] transition-[background-color,border-color,color] duration-150 disabled:pointer-events-none disabled:opacity-50 border";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ka-ink text-white border-ka-ink hover:bg-ka-ink-soft active:bg-ka-ink",
  secondary:
    "bg-ka-surface text-ka-ink border-ka-line-strong hover:border-ka-ink/50 hover:bg-ka-subtle",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-ka-small",
  md: "h-9 px-4 text-[0.875rem]",
  lg: "h-10 px-5 text-[0.9375rem]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
): string {
  return cn(BASE, SIZES[size], VARIANTS[variant], extra);
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type LinkButton = Common & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  >;

type NativeButton = Common & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export function Button(props: LinkButton | NativeButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = buttonClass(variant, size, className);
  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as NativeButton;
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
