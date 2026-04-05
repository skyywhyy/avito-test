import type { SelectOption } from './types'

export const categoryOptions: SelectOption[] = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'auto', label: 'Транспорт' },
  { value: 'real_estate', label: 'Недвижимость' },
]

export const typeOptions: SelectOption[] = [
  { value: 'laptop', label: 'Ноутбук' },
  { value: 'phone', label: 'Телефон' },
  { value: 'misc', label: 'Другое' },
]

export const conditionOptions: SelectOption[] = [
  { value: 'new', label: 'Новое' },
  { value: 'used', label: 'Б/У' },
  { value: 'refurbished', label: 'Восстановленное' },
]
