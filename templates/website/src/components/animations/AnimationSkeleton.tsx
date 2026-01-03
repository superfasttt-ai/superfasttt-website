import React from 'react'

interface AnimationSkeletonProps {
  className?: string
}

export function AnimationSkeleton({ className }: AnimationSkeletonProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted animate-pulse ${className || ''}`}
    >
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-emerald-500/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
    </div>
  )
}
