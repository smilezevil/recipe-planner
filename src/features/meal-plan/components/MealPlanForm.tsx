import { useId } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DAY_LABELS, DAYS, MEAL_TYPE_LABELS, MEAL_TYPES } from '../lib/labels'
import { mealPlanSchema } from '../model/mealPlanSchema'
import type { MealPlanFormData } from '../model/mealPlanSchema'
import './MealPlanForm.scss'

interface MealPlanFormProps {
    defaultValues: MealPlanFormData
    submitLabel: string
    onSubmit: (values: MealPlanFormData) => void
    onCancel: () => void
}

function MealPlanForm({ defaultValues, submitLabel, onSubmit, onCancel }: MealPlanFormProps) {
    const id = useId()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MealPlanFormData>({
        resolver: zodResolver(mealPlanSchema),
        defaultValues,
    })

    return (
        <form className="meal-plan-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="meal-plan-form__row">
                <div className="meal-plan-form__field">
                    <label className="meal-plan-form__label" htmlFor={`${id}-day`}>
                        День
                    </label>
                    <select id={`${id}-day`} className="meal-plan-form__input" {...register('day')}>
                        {DAYS.map((day) => (
                            <option key={day} value={day}>
                                {DAY_LABELS[day]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="meal-plan-form__field">
                    <label className="meal-plan-form__label" htmlFor={`${id}-meal`}>
                        Прийом їжі
                    </label>
                    <select id={`${id}-meal`} className="meal-plan-form__input" {...register('mealType')}>
                        {MEAL_TYPES.map((mealType) => (
                            <option key={mealType} value={mealType}>
                                {MEAL_TYPE_LABELS[mealType]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="meal-plan-form__field">
                <label className="meal-plan-form__label" htmlFor={`${id}-servings`}>
                    Порцій
                </label>
                <input
                    id={`${id}-servings`}
                    type="number"
                    className={`meal-plan-form__input ${errors.servings ? 'meal-plan-form__input--invalid' : ''}`}
                    aria-invalid={errors.servings ? true : undefined}
                    {...register('servings', { valueAsNumber: true })}
                />
                {errors.servings && <p className="meal-plan-form__error">{errors.servings.message}</p>}
            </div>

            <div className="meal-plan-form__field">
                <label className="meal-plan-form__label" htmlFor={`${id}-note`}>
                    Нотатка
                </label>
                <textarea
                    id={`${id}-note`}
                    rows={3}
                    className={`meal-plan-form__input ${errors.note ? 'meal-plan-form__input--invalid' : ''}`}
                    placeholder="Напр. купити свіжий базилік"
                    aria-invalid={errors.note ? true : undefined}
                    {...register('note')}
                />
                {errors.note && <p className="meal-plan-form__error">{errors.note.message}</p>}
            </div>

            <div className="meal-plan-form__actions">
                <button type="button" className="meal-plan-form__cancel" onClick={onCancel}>
                    Скасувати
                </button>
                <button type="submit" className="meal-plan-form__submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    )
}

export default MealPlanForm