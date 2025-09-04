"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  className?: string
  maxTags?: number
  error?: boolean
}

const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  ({ className, value = [], onChange, placeholder = "输入标签", maxTags = 10, error, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const addTag = (tag: string) => {
      const trimmedTag = tag.trim()
      if (!trimmedTag) return
      if (value.includes(trimmedTag)) return
      if (value.length >= maxTags) return

      const newTags = [...value, trimmedTag]
      onChange?.(newTags)
      setInputValue('')
    }

    const removeTag = (tagToRemove: string) => {
      const newTags = value.filter(tag => tag !== tagToRemove)
      onChange?.(newTags)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        addTag(inputValue)
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1])
      }
    }

    const handleAddClick = () => {
      addTag(inputValue)
      inputRef.current?.focus()
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-2",
          className
        )}
        {...props}
      >
        {/* 输入区域 */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length < maxTags ? placeholder : `最多 ${maxTags} 个标签`}
            disabled={value.length >= maxTags}
            error={error}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddClick}
            disabled={!inputValue.trim() || value.length >= maxTags}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 标签显示 */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="flex items-center space-x-1 py-1 px-2 hover:bg-primary-200 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 rounded-full hover:bg-primary-300 dark:hover:bg-dark-700 p-0.5 transition-colors duration-200"
                  aria-label={`删除标签 ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* 标签计数 */}
        <div className="text-xs text-primary-500 dark:text-warm-400">
          {value.length}/{maxTags} 个标签
        </div>
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export { TagInput }
