import type { Difficulty, RecipeSort } from '../model/types'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    Easy: 'Легко',
    Medium: 'Середньо',
    Hard: 'Складно',
}

export const SORT_LABELS: Record<RecipeSort, string> = {
    name: 'За назвою (А–Я)',
    rating: 'Найвищий рейтинг',
    calories: 'Найменше калорій',
    time: 'Найшвидші',
}

export const SORT_OPTIONS = Object.keys(SORT_LABELS) as RecipeSort[]

export function isRecipeSort(value: unknown): value is RecipeSort {
    return typeof value === 'string' && value in SORT_LABELS
}