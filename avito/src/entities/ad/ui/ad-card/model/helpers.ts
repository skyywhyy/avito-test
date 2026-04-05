import type { AdListItem } from '../../../model/types'

const categoryLabels: Record<AdListItem['category'], string> = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
}

export function getCardCategoryLabel(category: AdListItem['category']) {
  return categoryLabels[category]
}

export function formatCardPrice(price: number) {
  return `${price} ₽`
}

export function checkNeedsRevision(item: AdListItem): boolean {
  if (typeof item.needsRevision === 'boolean') {
    return item.needsRevision
  }

  if (!item.description || item.description.trim() === '') {
    return true
  }

  if (!item.params || Object.keys(item.params).length === 0) {
    return true
  }

  return Object.values(item.params).some((value) => value === undefined || value === null || value === '')
}
