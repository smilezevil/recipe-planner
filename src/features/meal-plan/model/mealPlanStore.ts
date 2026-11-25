import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MealPlanFormData } from './mealPlanSchema'
import type { MealPlanEntry } from './types'

interface RecipeRef {
    id: number
    name: string
}

interface MealPlanState {
    entries: MealPlanEntry[]
    addEntry: (recipe: RecipeRef, values: MealPlanFormData) => void
    updateEntry: (id: string, values: MealPlanFormData) => void
    removeEntry: (id: string) => void
    removeRecipeEntries: (recipeId: number) => void
    clearPlan: () => void
}

export const useMealPlanStore = create<MealPlanState>()(
    persist(
        (set) => ({
            entries: [],

            addEntry: (recipe, values) =>
                set((state) => ({
                    entries: [
                        ...state.entries,
                        {
                            id: crypto.randomUUID(),
                            recipeId: recipe.id,
                            recipeName: recipe.name,
                            ...values,
                        },
                    ],
                })),

            updateEntry: (id, values) =>
                set((state) => ({
                    entries: state.entries.map((entry) => (entry.id === id ? { ...entry, ...values } : entry)),
                })),

            removeEntry: (id) =>
                set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),

            removeRecipeEntries: (recipeId) =>
                set((state) => ({ entries: state.entries.filter((entry) => entry.recipeId !== recipeId) })),

            clearPlan: () => set({ entries: [] }),
        }),
        { name: 'recipe-planner:meal-plan' },
    ),
)