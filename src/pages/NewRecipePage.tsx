import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useCreateRecipe } from '../features/recipes/hooks/useCreateRecipe'
import { DIFFICULTY_LABELS } from '../features/recipes/lib/labels'
import { newRecipeSchema } from '../features/recipes/model/recipeSchema'
import type { NewRecipeData, NewRecipeFormValues } from '../features/recipes/model/recipeSchema'
import type { Difficulty } from '../features/recipes/model/types'
import { getErrorMessage } from '../shared/api/errors'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import { useToastStore } from '../shared/model/toastStore'
import FormField from '../shared/ui/FormField'
import StatusMessage from '../shared/ui/StatusMessage'
import './NewRecipePage.scss'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

const DEFAULT_VALUES: NewRecipeFormValues = {
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

function NewRecipePage() {
    const createRecipe = useCreateRecipe()
    const navigate = useNavigate()
    const showToast = useToastStore((state) => state.showToast)

    useDocumentTitle('Новий рецепт')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewRecipeFormValues, unknown, NewRecipeData>({
        resolver: zodResolver(newRecipeSchema),
        defaultValues: DEFAULT_VALUES,
    })

    function save(data: NewRecipeData) {
        createRecipe.mutate(data, {
            onSuccess: (recipe) => {
                showToast(`Рецепт «${recipe.name}» збережено`)
                navigate('/my-recipes')
            },
        })
    }

    function retry() {
        if (createRecipe.variables) {
            save(createRecipe.variables)
        }
    }

    const isPending = createRecipe.isPending

    return (
        <section className="new-recipe-page">
            <div>
                <Link className="new-recipe-page__back" to="/my-recipes">
                    ← Мої рецепти
                </Link>
                <h1 className="new-recipe-page__title">Новий рецепт</h1>
            </div>

            <form className="new-recipe-page__form" onSubmit={handleSubmit(save)} noValidate>
                <fieldset className="new-recipe-page__fields" disabled={isPending}>
                    <div className="new-recipe-page__row">
                        <FormField label="Назва *" htmlFor="recipe-name" error={errors.name?.message}>
                            <input id="recipe-name" placeholder="Напр. Сирники" {...register('name')} />
                        </FormField>
                        <FormField label="Кухня *" htmlFor="recipe-cuisine" error={errors.cuisine?.message}>
                            <input id="recipe-cuisine" placeholder="Напр. Ukrainian" {...register('cuisine')} />
                        </FormField>
                    </div>

                    <div className="new-recipe-page__row new-recipe-page__row--four">
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

                    <div className="new-recipe-page__row">
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

                {createRecipe.isError && (
                    <StatusMessage
                        variant="error"
                        title="Не вдалося зберегти рецепт"
                        text={getErrorMessage(createRecipe.error)}
                        action={
                            <button type="button" className="new-recipe-page__retry" onClick={retry}>
                                Спробувати ще
                            </button>
                        }
                    />
                )}

                <div className="new-recipe-page__actions">
                    <Link className="new-recipe-page__cancel" to="/my-recipes">
                        Скасувати
                    </Link>
                    <button type="submit" className="new-recipe-page__submit" disabled={isPending}>
                        {isPending ? 'Збереження...' : 'Зберегти рецепт'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default NewRecipePage