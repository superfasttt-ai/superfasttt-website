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
    <div className="fixed inset-x-0 top-[80px] z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Glassmorphism backdrop */}
        <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* Gradient accent top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" />

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                  {section.title && (
                    <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.15em] px-3">
                      {section.title}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {section.links?.map((linkItem, linkIndex) => (
                      <li key={linkIndex}>
                        <CMSLink
                          {...linkItem.link}
                          appearance="link"
                          className="group flex items-start gap-4 px-3 py-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-200"
                        >
                          {linkItem.icon && (
                            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800/80 text-xl group-hover:bg-zinc-700/80 group-hover:scale-105 transition-all duration-200">
                              {linkItem.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <span className="block font-medium text-[15px] text-zinc-100 group-hover:text-white transition-colors">
                              {linkItem.label}
                            </span>
                            {linkItem.description && (
                              <span className="block text-[13px] text-zinc-500 mt-0.5 leading-snug group-hover:text-zinc-400 transition-colors">
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

          {/* Gradient accent bottom */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}
