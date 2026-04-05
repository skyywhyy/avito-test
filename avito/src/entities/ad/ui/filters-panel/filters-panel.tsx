import { useState } from 'react'

import type { AdCategory } from '../../model/types'

import './filters-panel.css'

const categories = [
  { label: 'Авто', value: 'auto' },
  { label: 'Электроника', value: 'electronics' },
  { label: 'Недвижимость', value: 'real_estate' },
] as const
const downIcon = '/Down.svg'

type FiltersPanelProps = {
  needsRevisionOnly?: boolean
  selectedCategories?: AdCategory[]
  onNeedsRevisionToggle?: () => void
  onCategoryToggle?: (category: AdCategory) => void
  onReset?: () => void
}

export function FiltersPanel({
  needsRevisionOnly = false,
  selectedCategories = [],
  onNeedsRevisionToggle,
  onCategoryToggle,
  onReset,
}: FiltersPanelProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)

  return (
    <>
      <aside className="filters-panel">
        <h2 className="filters-panel__title">Фильтры</h2>
        <fieldset className="filters-panel__section">
          <div
            className="filters-panel__section-head"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span className="filters-panel__label">Категория</span>
            <span
              className={`filters-panel__chevron ${!isCategoriesOpen ? 'filters-panel__chevron--closed' : ''}`}
            >
              <img src={downIcon} alt="" aria-hidden="true" />
            </span>
          </div>

          <div
            className={`filters-panel__options ${!isCategoriesOpen ? 'filters-panel__options--closed' : ''}`}
          >
            <div className="filters-panel__options-inner">
              {categories.map((category) => (
                <label key={category.value} className="filters-panel__option">
                  <input
                    className="filters-panel__checkbox"
                    type="checkbox"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => onCategoryToggle?.(category.value)}
                  />
                  <span>{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="filters-panel__divider"></div>

        <div className="filters-panel__toggle-row">
          <span className="filters-panel__toggle-label">Только требующие доработок</span>
          <button
            className={`filters-panel__toggle ${needsRevisionOnly ? 'filters-panel__toggle--active' : ''}`}
            type="button"
            aria-label="Только требующие доработок"
            aria-pressed={needsRevisionOnly}
            onClick={onNeedsRevisionToggle}
          ></button>
        </div>
      </aside>
      <button className="filters-panel__reset" type="button" onClick={onReset}>
        Сбросить фильтры
      </button>
    </>
  )
}
