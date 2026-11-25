import { z } from 'zod'
import { DAYS, MEAL_TYPES } from '../lib/labels'

export const mealPlanSchema = z.object({
    day: z.enum(DAYS, 'Оберіть день'),
    mealType: z.enum(MEAL_TYPES, 'Оберіть прийом їжі'),
    servings: z
        .number('Вкажіть кількість порцій')
        .int('Кількість порцій має бути цілим числом')
        .min(1, 'Щонайменше 1 порція')
        .max(20, 'Не більше 20 порцій'),
    note: z.string().trim().max(200, 'Нотатка не може бути довшою за 200 символів'),
})

export type MealPlanFormData = z.infer<typeof mealPlanSchema>