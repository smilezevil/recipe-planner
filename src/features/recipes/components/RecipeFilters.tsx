import { useState } from 'react'
import type { FormEvent } from 'react'
import { SORT_LABELS, SORT_OPTIONS } from '../lib/labels'
import type { RecipeListParams, RecipeSort } from '../model/types'
import './RecipeFilters.scss'

interface RecipeFiltersProps {
    params: RecipeListParams
    tags: string[]
    isTagsLoading: boolean
    onSearch: (search: string) => void
    onTagChange: (tag: string) => void
    onSortChange: (sort: RecipeSort) => void
}

function RecipeFilters({
                           params,
                           tags,
                           isTagsLoading,
                           onSearch,
                           onTagChange,
                           onSortChange,
                       }: RecipeFiltersProps) {
    const [search, setSearch] = useState(params.search)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSearch(search)
    }

    return (
        <div className="recipe-filters">
            <form className="recipe-filters__search" role="search" onSubmit={handleSubmit}>
                <input
                    className="recipe-filters__input"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Пошук рецепта, напр. pizza"
                    aria-label="Пошук рецепта"
                />
                <button type="submit" className="recipe-filters__submit">
                    Знайти
                </button>
            </form>

            <select
                className="recipe-filters__select"
                value={params.tag}
                onChange={(event) => onTagChange(event.target.value)}
                disabled={isTagsLoading}
                aria-label="Фільтр за тегом"
            >
                <option value="">{isTagsLoading ? 'Завантаження тегів...' : 'Усі теги'}</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>

            <select
                className="recipe-filters__select"
                value={params.sort}
                onChange={(event) => onSortChange(event.target.value as RecipeSort)}
                aria-label="Сортування"
            >
                {SORT_OPTIONS.map((sort) => (
                    <option key={sort} value={sort}>
                        {SORT_LABELS[sort]}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default RecipeFilters