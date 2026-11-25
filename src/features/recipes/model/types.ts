export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type RecipeSort = 'name' | 'rating' | 'calories' | 'time'

export interface Recipe {
    id: number
    name: string
    image: string
    cuisine: string
    difficulty: Difficulty
    prepTimeMinutes: number
    cookTimeMinutes: number
    totalTimeMinutes: number
    servings: number
    caloriesPerServing: number
    rating: number
    reviewCount: number
    tags: string[]
    mealTypes: string[]
    ingredients: string[]
    instructions: string[]
    authorId: number | null
    isCustom: boolean
}

export interface RecipeListParams {
    page: number
    search: string
    tag: string
    sort: RecipeSort
}

export interface RecipePage {
    recipes: Recipe[]
    total: number
}