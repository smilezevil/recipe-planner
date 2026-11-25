import type { Difficulty, Recipe } from '../model/types'
import type { ApiRecipe } from './dto'

function toDifficulty(value: string | undefined): Difficulty {
    return value === 'Medium' || value === 'Hard' ? value : 'Easy'
}

export function toRecipe(dto: ApiRecipe): Recipe {
    const prepTimeMinutes = dto.prepTimeMinutes ?? 0
    const cookTimeMinutes = dto.cookTimeMinutes ?? 0

    return {
        id: dto.id,
        name: dto.name,
        image: dto.image ?? '',
        cuisine: dto.cuisine ?? 'Інша',
        difficulty: toDifficulty(dto.difficulty),
        prepTimeMinutes,
        cookTimeMinutes,
        totalTimeMinutes: prepTimeMinutes + cookTimeMinutes,
        servings: dto.servings ?? 1,
        caloriesPerServing: dto.caloriesPerServing ?? 0,
        rating: dto.rating ?? 0,
        reviewCount: dto.reviewCount ?? 0,
        tags: dto.tags ?? [],
        mealTypes: dto.mealType ?? [],
        ingredients: dto.ingredients ?? [],
        instructions: dto.instructions ?? [],
        authorId: dto.userId ?? null,
        isCustom: false,
    }
}