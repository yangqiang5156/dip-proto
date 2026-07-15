import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input-border bg-input-background px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all",
          "focus:border-input-focus-border focus:ring-2 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          className,
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
