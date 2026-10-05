import * as React from "react";
import { cn } from "../lib/cn";
import { labelClassName } from "../lib/field-styles";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label data-slot="label" className={cn(labelClassName, className)} {...props} />;
}

export { Label, labelClassName };
