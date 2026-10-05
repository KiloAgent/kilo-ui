import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { selectClassName } from "../lib/field-styles";

/** Progressive-enhancement <select> styled like kit Input. */
export function NativeSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select data-slot="native-select" className={cn(selectClassName, className)} {...props} />;
}
