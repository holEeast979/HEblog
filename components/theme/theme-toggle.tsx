"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative h-9 w-9 rounded-full bg-primary-100/50 backdrop-blur-sm border border-primary-200/50 hover:bg-primary-200/70 dark:bg-dark-800/50 dark:border-dark-700/50 dark:hover:bg-dark-700/70 transition-all duration-300"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">切换主题</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-9 w-9 rounded-full bg-primary-100/50 backdrop-blur-sm border border-primary-200/50 hover:bg-primary-200/70 dark:bg-dark-800/50 dark:border-dark-700/50 dark:hover:bg-dark-700/70 transition-all duration-300 glow-effect"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-primary-700 dark:text-warm-400 transition-colors duration-300" />
      ) : (
        <Sun className="h-4 w-4 text-primary-700 dark:text-warm-400 transition-colors duration-300" />
      )}
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
