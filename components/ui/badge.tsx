import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-800/30 dark:text-primary-300 dark:hover:bg-primary-700/30",
        secondary:
          "border-transparent bg-warm-100 text-warm-800 hover:bg-warm-200 dark:bg-warm-800/30 dark:text-warm-300 dark:hover:bg-warm-700/30",
        destructive:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
        outline: 
          "border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400 dark:border-dark-600 dark:text-warm-400 dark:hover:bg-dark-800 dark:hover:border-dark-500",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50",
        glow:
          "border-transparent bg-gradient-to-r from-primary-500 to-warm-500 text-white shadow-md hover:shadow-lg glow-effect",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
