import * as React from "react";
import { cn } from "../lib/cn";
import { textareaClassName } from "../lib/field-styles";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(textareaClassName, className)} {...props} />;
}

export { Textarea, textareaClassName };
