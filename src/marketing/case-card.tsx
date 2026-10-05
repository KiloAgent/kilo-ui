import { Badge } from "./badge";
import { Card } from "./card";

/** Testimonial / case card. The whole card links to the case study. */
export function CaseCard({
  href,
  name,
  eyebrow,
  summary,
  linkLabel,
  quote,
  attribution,
}: {
  href: string;
  name: string;
  eyebrow: string;
  summary: string;
  linkLabel: string;
  quote?: string;
  attribution?: string;
}) {
  return (
    <Card href={href} className="group flex h-full min-h-[18rem] flex-col">
      <div className="flex flex-col items-start gap-3">
        <Badge>{eyebrow}</Badge>
        <span className="text-ka-h3 font-semibold tracking-tight text-ka-ink">{name}</span>
      </div>
      {quote ? (
        <blockquote className="mt-5 text-ka-lead text-ka-ink">
          <p>{quote}</p>
          {attribution ? (
            <footer className="mt-3 text-ka-small text-ka-muted">{attribution}</footer>
          ) : null}
        </blockquote>
      ) : null}
      <p className="mt-4 flex-1 text-ka-body text-ka-muted">{summary}</p>
      <span className="mt-6 inline-flex text-ka-small font-medium text-ka-ink underline decoration-ka-line-strong underline-offset-4 transition-colors group-hover:decoration-ka-accent">
        {linkLabel}
      </span>
    </Card>
  );
}
