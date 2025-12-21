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
    <div className="fixed inset-x-0 top-[80px] z-50 flex justify-center">
      <div className="w-full animate-in fade-in slide-in-from-top-1 duration-150">
        {/* Simple background without border */}
        <div className="relative bg-white dark:bg-black">
          <div className="container mx-auto px-8 py-10">
            <div className="flex justify-center">
              <div className="flex gap-x-20">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-5 min-w-[180px]">
                    {section.title && (
                      <h3 className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em]">
                        {section.title}
                      </h3>
                    )}
                    <ul className="space-y-3">
                      {section.links?.map((linkItem, linkIndex) => (
                        <li key={linkIndex}>
                          <CMSLink
                            {...linkItem.link}
                            appearance="link"
                            className="group block py-1 transition-colors duration-150"
                          >
                            <span className="block font-normal text-[15px] text-black dark:text-white hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
                              {linkItem.label}
                            </span>
                          </CMSLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
