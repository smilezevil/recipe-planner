import { Link, useNavigate, useParams } from 'react-router'
import { useMealPlanStore } from '../features/meal-plan/model/mealPlanStore'
import RecipeForm from '../features/recipes/components/RecipeForm'
import { toRecipeFormValues } from '../features/recipes/lib/recipeFormValues'
import { useMyRecipesStore } from '../features/recipes/model/myRecipesStore'
import type { NewRecipeData } from '../features/recipes/model/recipeSchema'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import { useToastStore } from '../shared/model/toastStore'
import StatusMessage from '../shared/ui/StatusMessage'
import './EditRecipePage.scss'

function EditRecipePage() {
    const { recipeId } = useParams()
    const id = Number(recipeId)
    const recipe = useMyRecipesStore((state) => state.recipes.find((item) => item.id === id))
    const updateRecipe = useMyRecipesStore((state) => state.updateRecipe)
    const renameRecipeEntries = useMealPlanStore((state) => state.renameRecipeEntries)
    const showToast = useToastStore((state) => state.showToast)
    const navigate = useNavigate()

    useDocumentTitle(recipe ? `Редагування: ${recipe.name}` : 'Рецепт не знайдено')

    function save(data: NewRecipeData) {
        updateRecipe(id, data)
        renameRecipeEntries(id, data.name)
        showToast('Зміни збережено')
        navigate(`/recipes/${id}`, { replace: true })
    }

    if (!recipe) {
        return (
            <StatusMessage
                variant="empty"
                title="Рецепт не знайдено"
                text="Редагувати можна лише власні рецепти."
                action={
                    <Link className="edit-recipe-page__link" to="/my-recipes">
                        До моїх рецептів
                    </Link>
                }
            />
        )
    }

    return (
        <section className="edit-recipe-page">
            <div>
                <Link className="edit-recipe-page__back" to={`/recipes/${id}`}>
                    ← До рецепта
                </Link>
                <h1 className="edit-recipe-page__title">Редагування рецепта</h1>
            </div>

            <RecipeForm
                defaultValues={toRecipeFormValues(recipe)}
                submitLabel="Зберегти зміни"
                cancelTo={`/recipes/${id}`}
                onSubmit={save}
            />
        </section>
    )
}

export default EditRecipePage