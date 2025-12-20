'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const navLabel = data?.data?.label
  const type = data?.data?.type === 'mega-menu' ? ' (Mega-menu)' : ''
  const label = navLabel
    ? `${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}. ${navLabel}${type}`
    : 'Row'

  return <div>{label}</div>
}
