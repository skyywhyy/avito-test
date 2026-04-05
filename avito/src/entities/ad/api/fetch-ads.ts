import type { AdCategory, AdListItem, AdsSortColumn, AdsSortDirection } from '../model/types'
import { API_BASE_URL } from './config'

const PAGE_SIZE = 10

export type AdsListResponse = {
  items: AdListItem[]
  total: number
}

export type FetchAdsParams = {
  signal?: AbortSignal
  page: number
  query: string
  needsRevisionOnly: boolean
  selectedCategories: AdCategory[]
  sortValue: `${AdsSortColumn}-${AdsSortDirection}`
}

export async function fetchAdsList({
  signal,
  page,
  query,
  needsRevisionOnly,
  selectedCategories,
  sortValue,
}: FetchAdsParams): Promise<AdsListResponse> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
  })

  const trimmedQuery = query.trim()
  const [sortColumn, sortDirection] = sortValue.split('-')

  if (trimmedQuery) {
    params.set('q', trimmedQuery)
  }

  if (needsRevisionOnly) {
    params.set('needsRevision', 'true')
  }

  if (selectedCategories.length > 0) {
    params.set('categories', selectedCategories.join(','))
  }

  params.set('sortColumn', sortColumn)
  params.set('sortDirection', sortDirection)

  const response = await fetch(`${API_BASE_URL}/items?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error(`Не удалось загрузить объявления: ${response.status}`)
  }

  return response.json()
}

export { PAGE_SIZE }
