import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-dark-900 dark:focus-visible:ring-warm-400",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-lg hover:shadow-xl",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
        outline: "border-2 border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 hover:border-primary-400 dark:border-dark-600 dark:text-warm-300 dark:hover:bg-dark-800 dark:hover:border-dark-500",
        secondary: "bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-dark-700 dark:text-warm-100 dark:hover:bg-dark-600",
        ghost: "bg-transparent text-primary-700 hover:bg-primary-100 dark:text-warm-300 dark:hover:bg-dark-800",
        link: "text-primary-600 underline-offset-4 hover:underline dark:text-warm-400",
        warm: "bg-warm-500 text-white hover:bg-warm-600 active:bg-warm-700 shadow-lg hover:shadow-xl",
        glow: "bg-gradient-to-r from-primary-500 to-warm-500 text-white shadow-lg hover:shadow-2xl glow-effect"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
