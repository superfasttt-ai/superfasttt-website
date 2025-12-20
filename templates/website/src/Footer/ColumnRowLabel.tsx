'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['columns']>[number]>()

  const title = data?.data?.title
  const linksCount = data?.data?.links?.length || 0
  const label = title
    ? `${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}. ${title} (${linksCount} liens)`
    : 'Colonne'

  return <div>{label}</div>
}
