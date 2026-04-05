import type { AdCategory, ItemParams } from '../model/types'
import { API_BASE_URL } from './config'

export type AiRequestPayload = {
  itemId?: string
  category: AdCategory
  title: string
  description?: string
  price?: number
  params: ItemParams
}

type GenerateDescriptionResponse = {
  description?: string
  error?: string
}

export type EstimatePriceResponse = {
  price?: number
  reasoning?: string
  error?: string
}

type AiErrorResponse = {
  error?: string
  message?: string
}

function buildPayload(input: AiRequestPayload) {
  return {
    itemId: input.itemId,
    category: input.category,
    title: input.title,
    description: input.description,
    price: input.price,
    params: input.params ?? {},
  }
}

async function postAiRequest<TResponse>(path: string, payload: AiRequestPayload): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildPayload(payload)),
  })

  const responseJson = (await response.json()) as TResponse & AiErrorResponse

  if (!response.ok) {
    throw new Error(responseJson.error || responseJson.message || `Ошибка AI-сервиса: ${response.status}`)
  }

  if (responseJson.error || responseJson.message) {
    throw new Error(responseJson.error || responseJson.message)
  }

  return responseJson
}

export async function requestGeneratedDescription(payload: AiRequestPayload) {
  const response = await postAiRequest<GenerateDescriptionResponse>('/ai/generate-description', payload)

  if (!response.description) {
    throw new Error('AI не вернул описание')
  }

  return response.description
}

export async function requestEstimatedPrice(payload: AiRequestPayload) {
  const response = await postAiRequest<EstimatePriceResponse>('/ai/estimate-price', payload)

  if (typeof response.price !== 'number') {
    throw new Error('AI не вернул цену')
  }

  return response
}
