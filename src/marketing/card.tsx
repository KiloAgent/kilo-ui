import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type CardPadding = "md" | "lg";

const PADDING: Record<CardPadding, string> = {
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8 md:p-9",
};

export function cardClass(padding: CardPadding = "md", interactive = false, extra?: string) {
  return cn(
    "relative block rounded-ka-card border border-ka-line bg-ka-surface shadow-ka-card",
    PADDING[padding],
    interactive &&
      "transition-[border-color,background-color] duration-150 hover:border-ka-line-strong hover:bg-ka-subtle/40",
    extra,
  );
}

type DivProps = {
  href?: undefined;
  padding?: CardPadding;
  className?: string;
  id?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

type LinkProps = {
  href: string;
  padding?: CardPadding;
  className?: string;
  id?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children" | "id">;

/** Hairline-bordered surface. Pass `href` to render the whole card as a link. */
export function Card(props: DivProps | LinkProps) {
  const { padding = "md", className, id, children } = props;
  if ("href" in props && props.href) {
    const { href, padding: _p, className: _c, id: _i, children: _ch, ...rest } = props;
    return (
      <a href={href} id={id} className={cardClass(padding, true, className)} {...rest}>
        {children}
      </a>
    );
  }
  const {
    padding: _p,
    className: _c,
    id: _i,
    children: _ch,
    href: _h,
    ...rest
  } = props as DivProps;
  return (
    <div id={id} className={cardClass(padding, false, className)} {...rest}>
      {children}
    </div>
  );
}
