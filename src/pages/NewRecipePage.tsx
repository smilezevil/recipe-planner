import { Link, useNavigate } from 'react-router'
import RecipeForm from '../features/recipes/components/RecipeForm'
import { useCreateRecipe } from '../features/recipes/hooks/useCreateRecipe'
import { EMPTY_RECIPE_FORM } from '../features/recipes/lib/recipeFormValues'
import type { NewRecipeData } from '../features/recipes/model/recipeSchema'
import { getErrorMessage } from '../shared/api/errors'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import { useToastStore } from '../shared/model/toastStore'
import StatusMessage from '../shared/ui/StatusMessage'
import './NewRecipePage.scss'

function NewRecipePage() {
    const createRecipe = useCreateRecipe()
    const navigate = useNavigate()
    const showToast = useToastStore((state) => state.showToast)

    useDocumentTitle('Новий рецепт')

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

    return (
        <section className="new-recipe-page">
            <div>
                <Link className="new-recipe-page__back" to="/my-recipes">
                    ← Мої рецепти
                </Link>
                <h1 className="new-recipe-page__title">Новий рецепт</h1>
            </div>

            <RecipeForm
                defaultValues={EMPTY_RECIPE_FORM}
                submitLabel="Зберегти рецепт"
                cancelTo="/my-recipes"
                isPending={createRecipe.isPending}
                onSubmit={save}
            >
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
            </RecipeForm>
        </section>
    )
}

export default NewRecipePage