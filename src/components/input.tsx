import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../lib/cn";
import { inputClassName } from "../lib/field-styles";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputClassName, className)}
      {...props}
    />
  );
}

export { Input, inputClassName };
