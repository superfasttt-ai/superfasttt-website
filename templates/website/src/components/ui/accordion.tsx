'use client'

import * as React from 'react'
import { cn } from '@/utilities/ui'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

interface AccordionProps {
  children: React.ReactNode
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen)

  const toggleItem = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return allowMultiple ? [...prev, id] : [id]
      })
    },
    [allowMultiple],
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-border', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className }) => {
  return <div className={cn('', className)}>{children}</div>
}

interface AccordionTriggerProps {
  id: string
  children: React.ReactNode
  className?: string
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ id, children, className }) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be used within Accordion')

  const { openItems, toggleItem } = context
  const isOpen = openItems.includes(id)

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-foreground/80',
        className,
      )}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
    >
      {children}
      <svg
        className={cn(
          'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

interface AccordionContentProps {
  id: string
  children: React.ReactNode
  className?: string
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ id, children, className }) => {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionContent must be used within Accordion')

  const { openItems } = context
  const isOpen = openItems.includes(id)

  return (
    <div
      id={`accordion-content-${id}`}
      role="region"
      className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-[2000px] opacity-100 pb-4' : 'max-h-0 opacity-0',
      )}
      aria-hidden={!isOpen}
    >
      <div className={cn('text-muted-foreground', className)}>{children}</div>
    </div>
  )
}
