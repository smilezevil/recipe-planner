import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe } from './types'

interface MyRecipesState {
    recipes: Recipe[]
    addRecipe: (recipe: Recipe) => Recipe
    removeRecipe: (id: number) => void
}

export const useMyRecipesStore = create<MyRecipesState>()(
    persist(
        (set) => ({
            recipes: [],

            addRecipe: (recipe) => {
                const saved: Recipe = { ...recipe, id: Date.now(), authorId: null, isCustom: true }
                set((state) => ({ recipes: [saved, ...state.recipes] }))
                return saved
            },

            removeRecipe: (id) =>
                set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== id) })),
        }),
        { name: 'recipe-planner:my-recipes' },
    ),
)