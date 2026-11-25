export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealPlanEntry {
    id: string
    recipeId: number
    recipeName: string
    day: Day
    mealType: MealType
    servings: number
    note: string
}