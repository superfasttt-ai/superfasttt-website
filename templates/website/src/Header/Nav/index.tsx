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
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isOpen
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
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
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-all duration-200"
            >
              {label}
            </CMSLink>
          )
        }

        return null
      })}

      {/* Separator */}
      <div className="w-px h-6 bg-zinc-700 mx-2" />

      {/* Login Link */}
      {data.loginLink?.label && data.loginLink?.url && (
        <Link
          href={data.loginLink.url}
          className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-all duration-200"
        >
          {data.loginLink.label}
        </Link>
      )}

      {/* CTA Button */}
      {data.ctaButton?.label && data.ctaButton?.link && (
        <CMSLink
          {...data.ctaButton.link}
          appearance="default"
          className="ml-1 px-5 py-2.5 text-sm font-semibold bg-white text-zinc-900 rounded-full hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-white/10"
        >
          {data.ctaButton.label}
        </CMSLink>
      )}

      {/* Search */}
      <Link
        href="/search"
        className="ml-2 p-2.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-all duration-200"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4" />
      </Link>
    </nav>
  )
}
