'use client'

import React from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type MegaMenuSection = NonNullable<
  NonNullable<NonNullable<Header['navItems']>[number]['megaMenu']>['sections']
>[number]

interface MegaMenuProps {
  sections: MegaMenuSection[]
  onClose: () => void
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ sections }) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
      <div className="bg-background border border-border rounded-lg shadow-xl p-6 min-w-[600px] max-w-[900px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-2">
                {section.links?.map((linkItem, linkIndex) => (
                  <li key={linkIndex}>
                    <CMSLink
                      {...linkItem.link}
                      appearance="link"
                      className="group flex items-start gap-3 p-2 -m-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {linkItem.icon && (
                        <span className="text-lg flex-shrink-0">{linkItem.icon}</span>
                      )}
                      <div>
                        <span className="block font-medium text-sm group-hover:text-primary transition-colors">
                          {linkItem.label}
                        </span>
                        {linkItem.description && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {linkItem.description}
                          </span>
                        )}
                      </div>
                    </CMSLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
