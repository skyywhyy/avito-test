import type { ItemRecord } from '../../../entities/ad'
import { enumLabels, paramLabels, requiredParamKeysByCategory } from './constants'

export function formatPrice(price: number) {
  return `${price} ₽`
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getMissingFields(item: ItemRecord) {
  const missing: string[] = []
  const addMissingField = (field: string) => {
    if (!missing.includes(field)) {
      missing.push(field)
    }
  }

  if (!item.title?.trim()) {
    addMissingField('Название')
  }

  if (!Number.isFinite(item.price)) {
    addMissingField('Цена')
  }

  if (!item.description?.trim()) {
    addMissingField('Описание')
  }

  requiredParamKeysByCategory[item.category].forEach((key) => {
    const value = item.params?.[key]

    if (value === undefined || value === null || value === '') {
      addMissingField(paramLabels[key] ?? key)
    }
  })

  return missing
}

export function getVisibleParams(item: ItemRecord) {
  return Object.entries(item.params ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
}

export function formatParamLabel(key: string) {
  return paramLabels[key] ?? key
}

export function formatParamValue(value: string | number) {
  return enumLabels[String(value)] ?? String(value)
}
