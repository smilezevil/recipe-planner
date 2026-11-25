import { z } from 'zod'

function toLines(value: string): string[] {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
}

function toTags(value: string): string[] {
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
}

function minutesField(label: string) {
    return z
        .number(`Вкажіть ${label}`)
        .int('Має бути цілим числом')
        .min(0, 'Не може бути відʼємним')
        .max(600, 'Не більше 600 хвилин')
}

export const newRecipeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Назва має містити щонайменше 3 символи')
        .max(80, 'Назва не може бути довшою за 80 символів'),
    cuisine: z.string().trim().min(2, 'Вкажіть кухню').max(40, 'Не більше 40 символів'),
    image: z
        .string()
        .refine((value) => value === '' || value.startsWith('data:image/'), 'Некоректне зображення'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], 'Оберіть складність'),
    prepTimeMinutes: minutesField('час підготовки'),
    cookTimeMinutes: minutesField('час приготування'),
    servings: z.number('Вкажіть кількість порцій').int().min(1, 'Щонайменше 1 порція').max(20, 'Не більше 20'),
    caloriesPerServing: z
        .number('Вкажіть калорійність')
        .int()
        .min(0, 'Не може бути відʼємною')
        .max(3000, 'Не більше 3000 ккал'),
    ingredients: z
        .string()
        .transform(toLines)
        .pipe(z.array(z.string()).min(2, 'Додайте щонайменше 2 інгредієнти, кожен з нового рядка')),
    instructions: z
        .string()
        .transform(toLines)
        .pipe(z.array(z.string()).min(1, 'Опишіть хоча б один крок приготування')),
    tags: z
        .string()
        .transform(toTags)
        .pipe(z.array(z.string()).max(5, 'Не більше 5 тегів')),
})

export type NewRecipeFormValues = z.input<typeof newRecipeSchema>
export type NewRecipeData = z.output<typeof newRecipeSchema>