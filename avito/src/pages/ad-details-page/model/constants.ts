import type { AdCategory } from '../../../entities/ad'

export const paramLabels: Record<string, string> = {
  type: 'Тип',
  brand: 'Бренд',
  model: 'Модель',
  color: 'Цвет',
  condition: 'Состояние',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка',
  mileage: 'Пробег',
  enginePower: 'Мощность',
}

export const requiredParamKeysByCategory: Record<AdCategory, string[]> = {
  electronics: ['type', 'brand', 'model', 'color', 'condition'],
  auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower', 'color'],
  real_estate: ['type', 'address', 'area', 'floor'],
}

export const enumLabels: Record<string, string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
  new: 'Новый',
  used: 'Б/у',
  automatic: 'Автомат',
  manual: 'Механика',
}
