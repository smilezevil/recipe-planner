import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recipeKeys } from '../api/recipeKeys'
import { recipeRepository } from '../api/recipeRepository'
import { useMyRecipesStore } from '../model/myRecipesStore'

export function useCreateRecipe() {
    const queryClient = useQueryClient()
    const addRecipe = useMyRecipesStore((state) => state.addRecipe)

    return useMutation({
        mutationFn: recipeRepository.create,
        onSuccess: (created) => {
            addRecipe(created)
            return queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
        },
    })
}