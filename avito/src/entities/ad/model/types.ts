export const AD_CATEGORIES = ['electronics', 'auto', 'real_estate'] as const

export type AdCategory = (typeof AD_CATEGORIES)[number]
export type AdsSortColumn = 'title' | 'createdAt' | 'price'
export type AdsSortDirection = 'asc' | 'desc'
export type ItemParams = Record<string, string | number | undefined>

export type AdRouteParams = {
  id: string
}

export type ItemRecord = {
  id: string | number
  category: AdCategory
  title: string
  description?: string
  price: number
  createdAt: string
  updatedAt: string
  params?: ItemParams
}

export type AdListItem = ItemRecord & {
  needsRevision?: boolean
}

export type AdDetailsRecord = ItemRecord & {
  needsRevision: boolean
}

export const CATEGORY_LABELS: Record<AdCategory, string> = {
  electronics: 'Электроника',
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
}
