import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { isRecipeSort } from '../lib/labels'
import type { RecipeListParams, RecipeSort } from '../model/types'

function parsePage(value: string | null): number {
    const page = Number(value)
    return Number.isInteger(page) && page > 0 ? page : 1
}

export function useRecipeQueryParams() {
    const [searchParams, setSearchParams] = useSearchParams()

    const sortParam = searchParams.get('sort')

    const params: RecipeListParams = {
        page: parsePage(searchParams.get('page')),
        search: searchParams.get('q') ?? '',
        tag: searchParams.get('tag') ?? '',
        sort: isRecipeSort(sortParam) ? sortParam : 'name',
    }

    const update = useCallback(
        (changes: Record<string, string | null>) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)

                Object.entries(changes).forEach(([key, value]) => {
                    if (value) {
                        next.set(key, value)
                    } else {
                        next.delete(key)
                    }
                })

                return next
            })
        },
        [setSearchParams],
    )

    const setSearch = useCallback(
        (search: string) => update({ q: search.trim() || null, tag: null, page: null }),
        [update],
    )

    const setTag = useCallback((tag: string) => update({ tag: tag || null, q: null, page: null }), [update])

    const setSort = useCallback(
        (sort: RecipeSort) => update({ sort: sort === 'name' ? null : sort, page: null }),
        [update],
    )

    const setPage = useCallback(
        (page: number) => update({ page: page === 1 ? null : String(page) }),
        [update],
    )

    const resetFilters = useCallback(() => update({ q: null, tag: null, sort: null, page: null }), [update])

    return { params, setSearch, setTag, setSort, setPage, resetFilters }
}