import type { NewRecipeFormValues } from '../model/recipeSchema'
import type { Recipe } from '../model/types'

export const EMPTY_RECIPE_FORM: NewRecipeFormValues = {
    name: '',
    cuisine: '',
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    caloriesPerServing: 300,
    ingredients: '',
    instructions: '',
    tags: '',
}

export function toRecipeFormValues(recipe: Recipe): NewRecipeFormValues {
    return {
        name: recipe.name,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        servings: recipe.servings,
        caloriesPerServing: recipe.caloriesPerServing,
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions.join('\n'),
        tags: recipe.tags.join(', '),
    }
}