import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NewRecipeData } from './recipeSchema'
import type { Recipe } from './types'

interface MyRecipesState {
    recipes: Recipe[]
    addRecipe: (recipe: Recipe) => Recipe
    updateRecipe: (id: number, data: NewRecipeData) => void
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

            updateRecipe: (id, data) =>
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id
                            ? { ...recipe, ...data, totalTimeMinutes: data.prepTimeMinutes + data.cookTimeMinutes }
                            : recipe,
                    ),
                })),

            removeRecipe: (id) =>
                set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== id) })),
        }),
        { name: 'recipe-planner:my-recipes' },
    ),
)