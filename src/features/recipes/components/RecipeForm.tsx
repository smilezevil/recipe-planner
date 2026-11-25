import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import FormField from '../../../shared/ui/FormField'
import { DIFFICULTY_LABELS } from '../lib/labels'
import { newRecipeSchema } from '../model/recipeSchema'
import type { NewRecipeData, NewRecipeFormValues } from '../model/recipeSchema'
import type { Difficulty } from '../model/types'
import './RecipeForm.scss'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

interface RecipeFormProps {
    defaultValues: NewRecipeFormValues
    submitLabel: string
    cancelTo: string
    isPending?: boolean
    onSubmit: (data: NewRecipeData) => void
    children?: ReactNode
}

function RecipeForm({ defaultValues, submitLabel, cancelTo, isPending = false, onSubmit, children }: RecipeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewRecipeFormValues, unknown, NewRecipeData>({
        resolver: zodResolver(newRecipeSchema),
        defaultValues,
    })

    return (
        <form className="recipe-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset className="recipe-form__fields" disabled={isPending}>
                <div className="recipe-form__row">
                    <FormField label="Назва *" htmlFor="recipe-name" error={errors.name?.message}>
                        <input id="recipe-name" placeholder="Напр. Сирники" {...register('name')} />
                    </FormField>
                    <FormField label="Кухня *" htmlFor="recipe-cuisine" error={errors.cuisine?.message}>
                        <input id="recipe-cuisine" placeholder="Напр. Ukrainian" {...register('cuisine')} />
                    </FormField>
                </div>

                <div className="recipe-form__row recipe-form__row--four">
                    <FormField label="Складність" htmlFor="recipe-difficulty" error={errors.difficulty?.message}>
                        <select id="recipe-difficulty" {...register('difficulty')}>
                            {DIFFICULTIES.map((difficulty) => (
                                <option key={difficulty} value={difficulty}>
                                    {DIFFICULTY_LABELS[difficulty]}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Підготовка, хв" htmlFor="recipe-prep" error={errors.prepTimeMinutes?.message}>
                        <input id="recipe-prep" type="number" {...register('prepTimeMinutes', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Приготування, хв" htmlFor="recipe-cook" error={errors.cookTimeMinutes?.message}>
                        <input id="recipe-cook" type="number" {...register('cookTimeMinutes', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Порцій" htmlFor="recipe-servings" error={errors.servings?.message}>
                        <input id="recipe-servings" type="number" {...register('servings', { valueAsNumber: true })} />
                    </FormField>
                </div>

                <div className="recipe-form__row">
                    <FormField label="Калорії на порцію" htmlFor="recipe-calories" error={errors.caloriesPerServing?.message}>
                        <input
                            id="recipe-calories"
                            type="number"
                            {...register('caloriesPerServing', { valueAsNumber: true })}
                        />
                    </FormField>
                    <FormField
                        label="Теги"
                        htmlFor="recipe-tags"
                        error={errors.tags?.message}
                        hint="Через кому, напр. Breakfast, Quick"
                    >
                        <input id="recipe-tags" {...register('tags')} />
                    </FormField>
                </div>

                <FormField
                    label="Інгредієнти *"
                    htmlFor="recipe-ingredients"
                    error={errors.ingredients?.message}
                    hint="Кожен інгредієнт з нового рядка"
                >
                    <textarea id="recipe-ingredients" rows={5} {...register('ingredients')} />
                </FormField>

                <FormField
                    label="Кроки приготування *"
                    htmlFor="recipe-instructions"
                    error={errors.instructions?.message}
                    hint="Кожен крок з нового рядка"
                >
                    <textarea id="recipe-instructions" rows={5} {...register('instructions')} />
                </FormField>
            </fieldset>

            {children}

            <div className="recipe-form__actions">
                <Link className="recipe-form__cancel" to={cancelTo}>
                    Скасувати
                </Link>
                <button type="submit" className="recipe-form__submit" disabled={isPending}>
                    {isPending ? 'Збереження...' : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default RecipeForm