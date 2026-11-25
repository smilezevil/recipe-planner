import type { Day, MealType } from '../model/types'

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const satisfies readonly Day[]

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const satisfies readonly MealType[]

export const DAY_LABELS: Record<Day, string> = {
    mon: 'Понеділок',
    tue: 'Вівторок',
    wed: 'Середа',
    thu: 'Четвер',
    fri: 'Пʼятниця',
    sat: 'Субота',
    sun: 'Неділя',
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
    breakfast: 'Сніданок',
    lunch: 'Обід',
    dinner: 'Вечеря',
    snack: 'Перекус',
}