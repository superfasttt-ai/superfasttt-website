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
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        const { label, type, link, megaMenu } = item

        if (type === 'mega-menu' && megaMenu?.sections) {
          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.id || String(i))}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                {label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {openMenu === (item.id || String(i)) && (
                <MegaMenu sections={megaMenu.sections} onClose={() => setOpenMenu(null)} />
              )}
            </div>
          )
        }

        if (type === 'link' && link) {
          return (
            <CMSLink key={i} {...link} appearance="link">
              {label}
            </CMSLink>
          )
        }

        return null
      })}

      {/* CTA Button */}
      {data.ctaButton?.label && data.ctaButton?.link && (
        <CMSLink
          {...data.ctaButton.link}
          appearance="default"
          className="ml-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {data.ctaButton.label}
        </CMSLink>
      )}

      {/* Login Link */}
      {data.loginLink?.label && data.loginLink?.url && (
        <Link href={data.loginLink.url} className="text-sm hover:text-primary transition-colors">
          {data.loginLink.label}
        </Link>
      )}

      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
