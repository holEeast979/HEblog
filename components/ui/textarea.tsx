import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-300 placeholder:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-800/80 dark:text-warm-100 dark:placeholder:text-warm-500 resize-y",
          error
            ? "border-red-300 text-red-900 focus-visible:ring-red-500 dark:border-red-700 dark:text-red-100"
            : "border-primary-300 text-primary-900 focus-visible:ring-primary-500 hover:border-primary-400 dark:border-dark-600 dark:hover:border-dark-500 dark:focus-visible:ring-warm-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
