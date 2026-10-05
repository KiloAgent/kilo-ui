import type { ReactNode } from "react";
import { Badge } from "./badge";
import { Card } from "./card";

/** Founder card: photo, name, role, short note, then any actions as children. */
export function FounderCard({
  eyebrow,
  name,
  role,
  body,
  photoSrc,
  children,
}: {
  eyebrow: string;
  name: string;
  role: string;
  body: string;
  photoSrc: string;
  children?: ReactNode;
}) {
  return (
    <Card padding="lg">
      <Badge dot>{eyebrow}</Badge>
      <div className="mt-7 flex flex-col items-start gap-7 md:flex-row md:gap-9">
        <img
          src={photoSrc}
          alt={name}
          width="160"
          height="160"
          className="size-28 shrink-0 rounded-ka-card border border-ka-line object-cover md:size-36"
        />
        <div className="min-w-0">
          <h2 className="text-ka-h2 font-semibold tracking-tight text-ka-ink">{name}</h2>
          <p className="mt-2 font-ka-mono text-ka-label uppercase tracking-[0.1em] text-ka-faint">
            {role}
          </p>
          <p className="mt-4 text-ka-lead text-ka-muted">{body}</p>
          {children ? <div className="mt-7 flex flex-col items-start gap-3">{children}</div> : null}
        </div>
      </div>
    </Card>
  );
}
