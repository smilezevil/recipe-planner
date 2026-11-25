export interface ApiRecipe {
    id: number
    name: string
    image?: string
    cuisine?: string
    difficulty?: string
    prepTimeMinutes?: number
    cookTimeMinutes?: number
    servings?: number
    caloriesPerServing?: number
    rating?: number
    reviewCount?: number
    tags?: string[]
    mealType?: string[]
    ingredients?: string[]
    instructions?: string[]
    userId?: number
}

export interface ApiRecipesResponse {
    recipes: ApiRecipe[]
    total: number
    skip: number
    limit: number
}