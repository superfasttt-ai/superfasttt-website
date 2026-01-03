import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode, headers } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { defaultLocale, type Locale, isValidLocale } from '@/i18n/config'
import { generateOrganizationSchema, generateWebSiteSchema, JsonLdScript } from '@/utilities/jsonLd'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // Récupérer la locale depuis le middleware
  const headersList = await headers()
  const localeHeader = headersList.get('x-locale')
  const locale: Locale = localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang={locale} data-theme="light">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <JsonLdScript data={[generateOrganizationSchema(), generateWebSiteSchema()]} />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
