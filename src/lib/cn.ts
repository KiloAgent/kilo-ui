import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Ka type-scale utilities live under `text-ka-*` alongside ink/muted colors.
 * Default twMerge treats every `text-*` as one group, so `text-ka-h2` then
 * `text-ka-ink` drops the size (tiny titles), and `text-white` then
 * `text-ka-small` drops the color (black CTA with invisible label).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "ka-display",
            "ka-h1",
            "ka-h2",
            "ka-h3",
            "ka-lead",
            "ka-body",
            "ka-small",
            "ka-label",
          ],
        },
      ],
    },
  },
});

/** Merge Tailwind classes (shadcn `cn`). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
