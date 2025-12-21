import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import type { Locale } from '@/i18n/config'
import { defaultLocale } from '@/i18n/config'

type HeaderProps = {
  locale?: Locale
}

export async function Header({ locale = defaultLocale }: HeaderProps) {
  const headerData: HeaderType = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} locale={locale} />
}
