import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'light' | 'dark'
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    variant = 'dark',
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // dark variant = logo avec texte primary (pour fond clair)
  // light variant = logo avec texte blanc (pour fond sombre)
  const logoSrc = variant === 'light' ? '/logo-superfasttt.svg' : '/logo-superfasttt-primary.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="SUPERFASTTT Logo"
      width={200}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[12rem] w-full h-auto', className)}
      src={logoSrc}
    />
  )
}
