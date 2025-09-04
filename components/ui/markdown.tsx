"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // 自定义标题样式
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-primary-800 dark:text-warm-100 mb-6 mt-8 border-b border-primary-200 dark:border-dark-600 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-warm-100 mb-4 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-primary-700 dark:text-warm-200 mb-3 mt-5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium text-primary-700 dark:text-warm-200 mb-2 mt-4">
              {children}
            </h4>
          ),
          // 段落样式
          p: ({ children }) => (
            <p className="text-primary-700 dark:text-warm-200 leading-relaxed mb-4">
              {children}
            </p>
          ),
          // 列表样式
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-primary-700 dark:text-warm-200 mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-primary-700 dark:text-warm-200 mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-primary-700 dark:text-warm-200">
              {children}
            </li>
          ),
          // 代码块样式
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="relative">
                <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {match[1]}
                </div>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700 mb-4">
                  <code className={`${className} text-sm`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className="bg-primary-100 dark:bg-dark-700 text-primary-800 dark:text-warm-200 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          },
          // 引用样式
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-300 dark:border-warm-500 pl-4 py-2 my-4 bg-primary-50 dark:bg-warm-900/10 italic text-primary-600 dark:text-warm-400">
              {children}
            </blockquote>
          ),
          // 表格样式
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary-50 dark:bg-dark-700">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-primary-800 dark:text-warm-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-primary-700 dark:text-warm-200">
              {children}
            </td>
          ),
          // 链接样式
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-primary-600 dark:text-warm-400 hover:text-primary-700 dark:hover:text-warm-300 underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
            >
              {children}
            </a>
          ),
          // 水平线样式
          hr: () => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-primary-300 dark:via-warm-600 to-transparent" />
          ),
          // 强调文本样式
          strong: ({ children }) => (
            <strong className="font-semibold text-primary-800 dark:text-warm-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary-700 dark:text-warm-200">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
