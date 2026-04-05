import type { AdDetailsRecord, AdCategory, ItemParams } from '../model/types'
import { API_BASE_URL } from './config'

export type SaveAdPayload = {
  category: AdCategory
  title: string
  description?: string
  price: number
  params: ItemParams
}

export type SaveAdResponse = Partial<AdDetailsRecord> & {
  id: string | number
}

async function parseSaveResponse(response: Response): Promise<SaveAdResponse | null> {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json() as Promise<SaveAdResponse>
}

async function handleSaveResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Не удалось сохранить объявление: ${response.status}`)
  }

  return parseSaveResponse(response)
}

export async function createAd(payload: SaveAdPayload) {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleSaveResponse(response)
}

export async function updateAd(id: string, payload: SaveAdPayload) {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleSaveResponse(response)
}
