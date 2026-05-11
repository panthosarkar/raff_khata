import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-[rgba(0,238,255,0.16)] bg-[rgba(15,20,27,0.62)] px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-[rgba(243,251,255,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,238,255,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
