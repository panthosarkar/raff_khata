import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,238,255,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(0,238,255,0.14)] text-white hover:bg-[rgba(0,238,255,0.22)] border border-[rgba(0,238,255,0.22)]",
        secondary:
          "bg-[rgba(15,20,27,0.72)] text-white hover:bg-[rgba(15,20,27,0.9)] border border-[rgba(0,238,255,0.14)]",
        outline:
          "border border-[rgba(0,238,255,0.2)] bg-transparent text-white hover:bg-[rgba(0,238,255,0.08)]",
        ghost: "text-white hover:bg-[rgba(255,255,255,0.06)]",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-600 border border-rose-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner size="sm" /> : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
