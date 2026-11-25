import { useQueries, useQuery } from '@tanstack/react-query'
import { recipeKeys } from '../api/recipeKeys'
import { recipeRepository } from '../api/recipeRepository'

export function useRecipe(id: number, enabled = true) {
    return useQuery({
        queryKey: recipeKeys.detail(id),
        queryFn: ({ signal }) => recipeRepository.getById(id, signal),
        enabled,
    })
}

export function useRecipesByIds(ids: number[]) {
    return useQueries({
        queries: ids.map((id) => ({
            queryKey: recipeKeys.detail(id),
            queryFn: ({ signal }: { signal: AbortSignal }) => recipeRepository.getById(id, signal),
        })),
        combine: (results) => ({
            recipes: results.flatMap((result) => (result.data ? [result.data] : [])),
            isPending: results.some((result) => result.isPending),
            error: results.find((result) => result.isError)?.error ?? null,
            retryFailed: () => {
                results.forEach((result) => {
                    if (result.isError) {
                        void result.refetch()
                    }
                })
            },
        }),
    })
}