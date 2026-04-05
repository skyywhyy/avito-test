import type { AdListItem } from '../../../model/types'

export type AdCardVariant = 'grid' | 'list'

export type AdCardProps = {
  item: AdListItem
  onClick: (id: string) => void
  variant?: AdCardVariant
}
