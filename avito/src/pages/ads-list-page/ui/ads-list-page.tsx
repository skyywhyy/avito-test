import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination, Stack } from '@mui/material'

import type { AdCategory, AdsSortColumn, AdsSortDirection } from '../../../entities/ad'
import { AdCard, FiltersPanel, PAGE_SIZE, useAdsList } from '../../../entities/ad'
import { buildRoutePath } from '../../../app/routing/config/route-paths'
import { SearchIcon, GridIcon, ListIcon } from '../../../shared/ui';

import './ads-list-page.css'

const downIcon = '/Down.svg'

const sortOptions: Array<{
    value: `${AdsSortColumn}-${AdsSortDirection}`
    label: string
}> = [
    { value: 'title-asc', label: 'По названию (А → Я)' },
    { value: 'title-desc', label: 'По названию (Я → А)' },
    { value: 'createdAt-desc', label: 'По новизне (сначала новые)' },
    { value: 'createdAt-asc', label: 'По новизне (сначала старые)' },
    { value: 'price-asc', label: 'По цене (сначала дешевле)' },
    { value: 'price-desc', label: 'По цене (сначала дороже)' },
]




export function AdsListPage() {
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [needsRevisionOnly, setNeedsRevisionOnly] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<AdCategory[]>([])
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [selectedSortValue, setSelectedSortValue] = useState<`${AdsSortColumn}-${AdsSortDirection}`>('createdAt-desc')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const selectedSort = useMemo(
        () => sortOptions.find((option) => option.value === selectedSortValue) ?? sortOptions[0],
        [selectedSortValue]
    )

    const { items, totalItems, isLoading, error } = useAdsList({
        page,
        query,
        needsRevisionOnly,
        selectedCategories,
        sortValue: selectedSortValue,
    })

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

    const handleCategoryToggle = (category: AdCategory) => {
        setSelectedCategories((current) =>
            current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
        )
        setPage(1)
    }

    const handleNeedsRevisionToggle = () => {
        setNeedsRevisionOnly((value) => !value)
        setPage(1)
    }

    const handleResetFilters = () => {
        setQuery('')
        setNeedsRevisionOnly(false)
        setSelectedCategories([])
        setSelectedSortValue('createdAt-desc')
        setPage(1)
    }

    return (
        <div className="ads-container">
            <header className="container">
                <div className="header">
                    <span>Мои объявления</span>
                    <span>{totalItems} объявлений</span>
                </div>
            </header>

            <div className="ads-search">
                <label className="ads-search__field">
                    <input
                        className="ads-search__input"
                        type="text"
                        value={query}
                        placeholder="Найти объявление..."
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setQuery(event.target.value)
                            setPage(1)
                        }}
                    />
                    <SearchIcon />
                </label>

                <div className="ads-search__view-switch" aria-label="Переключение вида">
                    <button
                        className={`ads-search__view-button ${viewMode === 'grid' ? 'ads-search__view-button--active' : ''}`}
                        type="button"
                        aria-label="Плитка"
                        onClick={() => setViewMode('grid')}
                    >
                        <GridIcon />
                    </button>
                    <button
                        className={`ads-search__view-button ${viewMode === 'list' ? 'ads-search__view-button--active' : ''}`}
                        type="button"
                        aria-label="Список"
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon />
                    </button>
                </div>

                <div className="ads-search__sort">
                    <button
                        className="ads-search__sort-trigger"
                        type="button"
                        onClick={() => setIsSortOpen((value) => !value)}
                    >
                        <span className="ads-search__sort-value">{selectedSort.label}</span>
                        <span className={`ads-search__sort-chevron ${isSortOpen ? 'ads-search__sort-chevron--open' : ''}`}>
                            <img src={downIcon} alt="" aria-hidden="true" />
                        </span>
                    </button>

                    <div className={`ads-search__sort-menu ${isSortOpen ? 'ads-search__sort-menu--open' : ''}`}>
                        <div className="ads-search__sort-menu-inner">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    className={`ads-search__sort-option ${selectedSort.value === option.value ? 'ads-search__sort-option--active' : ''}`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSortValue(option.value)
                                        setPage(1)
                                        setIsSortOpen(false)
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-container">
                <aside className="filter-pan">
                    <FiltersPanel
                        needsRevisionOnly={needsRevisionOnly}
                        selectedCategories={selectedCategories}
                        onNeedsRevisionToggle={handleNeedsRevisionToggle}
                        onCategoryToggle={handleCategoryToggle}
                        onReset={handleResetFilters}
                    />
                </aside>

                <main className="main-container">
                    {isLoading && <div className="ads-list-page__status">Загрузка объявлений...</div>}

                    {!isLoading && error && (
                        <div className="ads-list-page__status ads-list-page__status--error">{error}</div>
                    )}

                    {!isLoading && !error && items.length === 0 && (
                        <div className="ads-list-page__status">По вашему запросу ничего не найдено.</div>
                    )}

                    {!isLoading && !error && items.length > 0 && (
                        <>
                            <div className={viewMode === 'grid' ? 'cards-grid' : 'cards-list'}>
                                {items.map((item) => (
                                    <AdCard
                                        key={item.id}
                                        item={item}
                                        variant={viewMode}
                                        onClick={(id) => navigate(buildRoutePath.adDetails(id))}
                                    />
                                ))}
                            </div>

                            <Stack className="ads-pagination" spacing={2}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    shape="rounded"
                                    boundaryCount={1}
                                    variant="outlined"
                                    onChange={(_, value) => setPage(value)}
                                />
                            </Stack>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}
