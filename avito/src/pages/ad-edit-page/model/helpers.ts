import type { AdCategory, AiRequestPayload, ItemParams, SaveAdPayload } from '../../../entities/ad'
import type { AdEditFormState, AiButtonStatus } from './types'

export function getAiButtonText(status: AiButtonStatus, defaultText: string) {
  if (status === 'loading') {
    return 'Обрабатывается запрос'
  }

  if (status === 'success') {
    return 'Повторить запрос'
  }

  if (status === 'error') {
    return defaultText
  }

  return defaultText
}

export function normalizeAiText(text: string) {
  return text
    .replace(/\\n/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]*\n+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim()
}

export function buildAiPayload(id: string, form: AdEditFormState): AiRequestPayload {
  return {
    itemId: id === 'unknown' ? undefined : id,
    category: form.category,
    title: form.title,
    description: form.description,
    price: form.price.trim() ? Number(form.price) : undefined,
    params: form.params,
  }
}

export function getDefaultParams(category: AdCategory): ItemParams {
  if (category === 'electronics') {
    return {
      type: 'laptop',
      condition: 'used',
    }
  }

  if (category === 'real_estate') {
    return {
      type: 'flat',
    }
  }

  return {}
}

export function normalizeFormParams(category: AdCategory, params: ItemParams | undefined): ItemParams {
  return {
    ...getDefaultParams(category),
    ...(params ?? {}),
  }
}

export function buildSavePayload(form: AdEditFormState): SaveAdPayload {
  const normalizedParams = Object.fromEntries(
    Object.entries(normalizeFormParams(form.category, form.params)).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  )

  return {
    category: form.category,
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    price: Number(form.price.trim()),
    params: normalizedParams,
  }
}

export function getDraftStorageKey(id: string) {
  return `ad-edit-draft:${id}`
}

export function saveDraftToStorage(id: string, form: AdEditFormState) {
  window.localStorage.setItem(getDraftStorageKey(id), JSON.stringify(form))
}

export function loadDraftFromStorage(id: string): AdEditFormState | null {
  const rawDraft = window.localStorage.getItem(getDraftStorageKey(id))

  if (!rawDraft) {
    return null
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as AdEditFormState

    return {
      ...parsedDraft,
      params: normalizeFormParams(parsedDraft.category, parsedDraft.params),
    }
  } catch {
    return null
  }
}

export function clearDraftFromStorage(id: string) {
  window.localStorage.removeItem(getDraftStorageKey(id))
}
