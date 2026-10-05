import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Badge } from "./badge";
import { H2, Lead } from "./typography";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative z-10 py-ka-section-sm md:py-ka-section", className)}>
      {children}
    </section>
  );
}

export type ContainerSize = "sm" | "md" | "lg";

const CONTAINER: Record<ContainerSize, string> = {
  sm: "max-w-ka-sm",
  md: "max-w-ka-md",
  lg: "max-w-ka-lg",
};

export function Container({
  size = "lg",
  className,
  children,
}: {
  size?: ContainerSize;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-5 lg:px-8", CONTAINER[size], className)}>{children}</div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto text-center" : "", "max-w-2xl", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <H2 className={eyebrow ? "mt-4" : undefined}>{title}</H2>
      {lede ? <Lead className="mt-3">{lede}</Lead> : null}
    </div>
  );
}
