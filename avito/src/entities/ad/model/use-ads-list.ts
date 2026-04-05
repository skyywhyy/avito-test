import { useEffect, useState } from 'react'

import type { AdListItem } from './types'
import { fetchAdsList, type FetchAdsParams } from '../api/fetch-ads.ts'

export function useAdsList(params: Omit<FetchAdsParams, 'signal'>) {
  const [items, setItems] = useState<AdListItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetchAdsList({ ...params, signal: controller.signal })
      .then((data) => {
        setItems(data.items)
        setTotalItems(data.total)
      })
      .catch((requestError: unknown) => {
        if ((requestError as DOMException).name === 'AbortError') {
          return
        }

        setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить объявления')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [params.needsRevisionOnly, params.page, params.query, params.selectedCategories, params.sortValue])

  return { items, totalItems, isLoading, error }
}
