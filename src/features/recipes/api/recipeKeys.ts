import type { RecipeListParams } from '../model/types'

export const recipeKeys = {
    all: ['recipes'] as const,
    lists: () => [...recipeKeys.all, 'list'] as const,
    list: (params: RecipeListParams) => [...recipeKeys.lists(), params] as const,
    details: () => [...recipeKeys.all, 'detail'] as const,
    detail: (id: number) => [...recipeKeys.details(), id] as const,
    tags: () => [...recipeKeys.all, 'tags'] as const,
}