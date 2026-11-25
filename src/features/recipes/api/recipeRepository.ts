import { request, toQueryString } from '../../../shared/api/httpClient'
import { PAGE_SIZE } from '../../../shared/config'
import type { RecipeListParams, RecipePage, RecipeSort, Recipe } from '../model/types'
import type { ApiRecipe, ApiRecipesResponse } from './dto'
import { toRecipe } from './mappers'

const SORT_PARAMS: Record<RecipeSort, { sortBy: string; order: 'asc' | 'desc' }> = {
    name: { sortBy: 'name', order: 'asc' },
    rating: { sortBy: 'rating', order: 'desc' },
    calories: { sortBy: 'caloriesPerServing', order: 'asc' },
    time: { sortBy: 'prepTimeMinutes', order: 'asc' },
}

function getListPath({ search, tag }: RecipeListParams): string {
    if (search) {
        return '/recipes/search'
    }

    if (tag) {
        return `/recipes/tag/${encodeURIComponent(tag)}`
    }

    return '/recipes'
}

export const recipeRepository = {
    async getList(params: RecipeListParams, signal?: AbortSignal): Promise<RecipePage> {
        const query = toQueryString({
            q: params.search || undefined,
            limit: PAGE_SIZE,
            skip: (params.page - 1) * PAGE_SIZE,
            ...SORT_PARAMS[params.sort],
        })

        const data = await request<ApiRecipesResponse>(`${getListPath(params)}${query}`, { signal })
        return { recipes: data.recipes.map(toRecipe), total: data.total }
    },

    async getById(id: number, signal?: AbortSignal): Promise<Recipe> {
        const data = await request<ApiRecipe>(`/recipes/${id}`, { signal })
        return toRecipe(data)
    },

    async getTags(signal?: AbortSignal): Promise<string[]> {
        return request<string[]>('/recipes/tags', { signal })
    },
}