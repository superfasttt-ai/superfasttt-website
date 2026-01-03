'use client'

import React from 'react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

type BackgroundStyle = 'white' | 'muted'

interface FAQBlockComponentProps extends FAQBlockProps {
  backgroundStyle?: BackgroundStyle
}

export const FAQBlock: React.FC<FAQBlockComponentProps> = ({
  badge,
  title,
  description,
  items,
  allowMultipleOpen,
  backgroundStyle = 'white',
}) => {
  return (
    <section className={cn('py-24', backgroundStyle === 'muted' ? 'bg-muted/50' : 'bg-background')}>
      <div className="container px-4 md:px-6">
        {(badge || title || description) && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {badge && (
              <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4">
                {badge}
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <Accordion allowMultiple={allowMultipleOpen || false}>
            {items?.map((item, index) => {
              const itemId = `faq-${index}`
              return (
                <AccordionItem key={itemId} id={itemId}>
                  <AccordionTrigger id={itemId} className="text-lg text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent id={itemId}>
                    <RichText data={item.answer} enableGutter={false} enableProse={true} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
