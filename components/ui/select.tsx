import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
  disabled?: boolean
  error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, placeholder, options, disabled, error, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-800/80 dark:text-warm-100 appearance-none cursor-pointer",
            error
              ? "border-red-300 text-red-900 focus-visible:ring-red-500 dark:border-red-700 dark:text-red-100"
              : "border-primary-300 text-primary-900 focus-visible:ring-primary-500 hover:border-primary-400 dark:border-dark-600 dark:hover:border-dark-500 dark:focus-visible:ring-warm-400",
            className
          )}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400 dark:text-warm-500 pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
