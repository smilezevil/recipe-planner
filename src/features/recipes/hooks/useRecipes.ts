import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { recipeKeys } from '../api/recipeKeys'
import { recipeRepository } from '../api/recipeRepository'
import type { RecipeListParams } from '../model/types'

export function useRecipes(params: RecipeListParams) {
    return useQuery({
        queryKey: recipeKeys.list(params),
        queryFn: ({ signal }) => recipeRepository.getList(params, signal),
        placeholderData: keepPreviousData,
    })
}

export function useRecipeTags() {
    return useQuery({
        queryKey: recipeKeys.tags(),
        queryFn: ({ signal }) => recipeRepository.getTags(signal),
        staleTime: Infinity,
    })
}

export function usePrefetchRecipes() {
    const queryClient = useQueryClient()

    const prefetchList = useCallback(
        (params: RecipeListParams) =>
            queryClient.prefetchQuery({
                queryKey: recipeKeys.list(params),
                queryFn: ({ signal }) => recipeRepository.getList(params, signal),
            }),
        [queryClient],
    )

    const prefetchRecipe = useCallback(
        (id: number) =>
            queryClient.prefetchQuery({
                queryKey: recipeKeys.detail(id),
                queryFn: ({ signal }) => recipeRepository.getById(id, signal),
            }),
        [queryClient],
    )

    return { prefetchList, prefetchRecipe }
}