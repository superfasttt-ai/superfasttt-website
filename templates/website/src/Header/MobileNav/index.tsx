'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, X } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LanguageSelector } from '../LanguageSelector'

interface MobileNavProps {
  data: HeaderType
  isOpen: boolean
  onClose: () => void
  locale?: string
}

export const MobileNav: React.FC<MobileNavProps> = ({ data, isOpen, onClose, locale = 'fr' }) => {
  const navItems = data?.navItems || []
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Mobile Menu Panel */}
      <div className="fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top duration-300">
        <div className="mx-4 mt-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <span className="text-white font-semibold">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            {navItems.map((item, i) => {
              const { label, type, link, megaMenu } = item
              const itemId = item.id || String(i)
              const isExpanded = expandedMenu === itemId

              if (type === 'mega-menu' && megaMenu?.sections) {
                return (
                  <div key={i} className="space-y-2">
                    <button
                      onClick={() => setExpandedMenu(isExpanded ? null : itemId)}
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-white font-medium rounded-xl hover:bg-zinc-800/50 transition-colors"
                    >
                      {label}
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        {megaMenu.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="space-y-1">
                            {section.title && (
                              <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                {section.title}
                              </div>
                            )}
                            {section.links?.map((linkItem, linkIndex) => (
                              <CMSLink
                                key={linkIndex}
                                {...linkItem.link}
                                appearance="link"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                                onClick={onClose}
                              >
                                {linkItem.icon && (
                                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-base">
                                    {linkItem.icon}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className="block text-sm font-medium text-zinc-100">
                                    {linkItem.label}
                                  </span>
                                  {linkItem.description && (
                                    <span className="block text-xs text-zinc-500 mt-0.5">
                                      {linkItem.description}
                                    </span>
                                  )}
                                </div>
                              </CMSLink>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              if (type === 'link' && link) {
                return (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="link"
                    className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-zinc-800/50 transition-colors"
                    onClick={onClose}
                  >
                    {label}
                  </CMSLink>
                )
              }

              return null
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-zinc-800 space-y-4">
            {/* Language Selector */}
            {data.showLanguageSelector && (
              <div className="pb-2">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">
                  Langue
                </div>
                <LanguageSelector currentLocale={locale} variant="inline" onSelect={onClose} />
              </div>
            )}

            {/* Login Link */}
            {data.loginLink?.label && data.loginLink?.url && (
              <Link
                href={data.loginLink.url}
                onClick={onClose}
                className="block w-full px-4 py-3 text-center text-zinc-300 font-medium rounded-xl border border-zinc-700 hover:bg-zinc-800/50 transition-colors"
              >
                {data.loginLink.label}
              </Link>
            )}

            {/* CTA Button */}
            {data.ctaButton?.label && data.ctaButton?.link && (
              <CMSLink
                {...data.ctaButton.link}
                appearance="default"
                className="block w-full px-4 py-3 text-center text-zinc-900 font-semibold bg-white rounded-xl hover:bg-zinc-200 transition-colors"
                onClick={onClose}
              >
                {data.ctaButton.label}
              </CMSLink>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
