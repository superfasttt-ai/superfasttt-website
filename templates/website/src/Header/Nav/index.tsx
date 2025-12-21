'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SearchIcon, ChevronDown } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MegaMenu } from '../MegaMenu'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item, i) => {
        const { label, type, link, megaMenu } = item

        if (type === 'mega-menu' && megaMenu?.sections) {
          const isOpen = openMenu === (item.id || String(i))
          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.id || String(i))}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isOpen
                    ? 'text-black dark:text-white'
                    : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                }`}
              >
                {label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
                {/* Indicateur blanc sous la rubrique active */}
                {isOpen && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-black dark:bg-white" />
                )}
              </button>
              {/* Zone de liaison invisible pour éviter que le menu se ferme */}
              {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] h-[60px]" />
              )}
              {isOpen && (
                <MegaMenu sections={megaMenu.sections} onClose={() => setOpenMenu(null)} />
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
              className="px-4 py-2 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-200"
            >
              {label}
            </CMSLink>
          )
        }

        return null
      })}

      {/* Separator */}
      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-2" />

      {/* Login Link */}
      {data.loginLink?.label && data.loginLink?.url && (
        <Link
          href={data.loginLink.url}
          className="px-4 py-2 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-200"
        >
          {data.loginLink.label}
        </Link>
      )}

      {/* CTA Button */}
      {data.ctaButton?.label && data.ctaButton?.link && (
        <CMSLink
          {...data.ctaButton.link}
          appearance="default"
          className="ml-1 px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all duration-200"
        >
          {data.ctaButton.label}
        </CMSLink>
      )}

      {/* Search */}
      <Link
        href="/search"
        className="ml-2 p-2.5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-200"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4" />
      </Link>
    </nav>
  )
}
