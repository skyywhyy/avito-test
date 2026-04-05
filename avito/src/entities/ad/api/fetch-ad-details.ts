import type { AdDetailsRecord } from '../model/types'
import { API_BASE_URL } from './config'

export async function fetchAdDetails(id: string, signal?: AbortSignal): Promise<AdDetailsRecord> {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, { signal })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Объявление не найдено')
    }

    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  return response.json()
}
