import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useAuthor } from '../features/authors/hooks/useAuthor'
import FavoriteButton from '../features/favorites/components/FavoriteButton'
import AddToPlanButton from '../features/meal-plan/components/AddToPlanButton'
import { useMealPlanStore } from '../features/meal-plan/model/mealPlanStore'
import { useRecipe } from '../features/recipes/hooks/useRecipe'
import { DIFFICULTY_LABELS } from '../features/recipes/lib/labels'
import { useMyRecipesStore } from '../features/recipes/model/myRecipesStore'
import type { Recipe } from '../features/recipes/model/types'
import { getErrorMessage } from '../shared/api/errors'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import { useToastStore } from '../shared/model/toastStore'
import StatusMessage from '../shared/ui/StatusMessage'
import NotFoundPage from './NotFoundPage'
import './RecipeDetailsPage.scss'

interface AuthorInfoProps {
    authorId: number | null
}

function AuthorInfo({ authorId }: AuthorInfoProps) {
    const authorQuery = useAuthor(authorId)

    if (authorId === null) {
        return <p className="recipe-details__author">Автор: ви</p>
    }

    if (authorQuery.isPending) {
        return <p className="recipe-details__author">Завантаження автора...</p>
    }

    if (authorQuery.isError) {
        return (
            <p className="recipe-details__author recipe-details__author--error">
                Не вдалося завантажити автора.{' '}
                <button type="button" className="recipe-details__inline-button" onClick={() => authorQuery.refetch()}>
                    Повторити
                </button>
            </p>
        )
    }

    return (
        <p className="recipe-details__author">
            Автор: <strong>{authorQuery.data.fullName}</strong> @{authorQuery.data.username}
        </p>
    )
}

interface RecipeDetailsProps {
    recipe: Recipe
    onDelete?: () => void
}

function RecipeDetails({ recipe, onDelete }: RecipeDetailsProps) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

    return (
        <article className="recipe-details">
            <div className="recipe-details__hero">
                <div className="recipe-details__media">
                    {recipe.image ? (
                        <img className="recipe-details__image" src={recipe.image} alt={recipe.name} />
                    ) : (
                        <span className="recipe-details__placeholder" aria-hidden="true">
              🍽️
            </span>
                    )}
                </div>

                <div className="recipe-details__summary">
                    <p className="recipe-details__cuisine">
                        {recipe.cuisine} · {DIFFICULTY_LABELS[recipe.difficulty]}
                    </p>
                    <h1 className="recipe-details__title">{recipe.name}</h1>
                    <AuthorInfo authorId={recipe.authorId} />

                    <dl className="recipe-details__facts">
                        <div>
                            <dt>Підготовка</dt>
                            <dd>{recipe.prepTimeMinutes} хв</dd>
                        </div>
                        <div>
                            <dt>Приготування</dt>
                            <dd>{recipe.cookTimeMinutes} хв</dd>
                        </div>
                        <div>
                            <dt>Порцій</dt>
                            <dd>{recipe.servings}</dd>
                        </div>
                        <div>
                            <dt>Калорії</dt>
                            <dd>{recipe.caloriesPerServing} ккал</dd>
                        </div>
                        {!recipe.isCustom && (
                            <div>
                                <dt>Рейтинг</dt>
                                <dd>
                                    ⭐ {recipe.rating.toFixed(1)} ({recipe.reviewCount})
                                </dd>
                            </div>
                        )}
                    </dl>

                    {recipe.tags.length > 0 && (
                        <ul className="recipe-details__tags">
                            {recipe.tags.map((tag) => (
                                <li key={tag}>
                                    {recipe.isCustom ? (
                                        <span className="recipe-details__tag">#{tag}</span>
                                    ) : (
                                        <Link className="recipe-details__tag" to={`/recipes?tag=${encodeURIComponent(tag)}`}>
                                            #{tag}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="recipe-details__actions">
                        <AddToPlanButton
                            recipeId={recipe.id}
                            recipeName={recipe.name}
                            defaultServings={Math.min(recipe.servings, 20)}
                        />
                        {recipe.isCustom ? (
                            isConfirmingDelete ? (
                                <>
                                    <button type="button" className="recipe-details__danger" onClick={onDelete}>
                                        Так, видалити
                                    </button>
                                    <button
                                        type="button"
                                        className="recipe-details__secondary"
                                        onClick={() => setIsConfirmingDelete(false)}
                                    >
                                        Ні
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link className="recipe-details__secondary" to={`/recipes/${recipe.id}/edit`}>
                                        Редагувати
                                    </Link>
                                    <button
                                        type="button"
                                        className="recipe-details__danger"
                                        onClick={() => setIsConfirmingDelete(true)}
                                    >
                                        Видалити рецепт
                                    </button>
                                </>
                            )
                        ) : (
                            <FavoriteButton recipeId={recipe.id} recipeName={recipe.name} variant="full" />
                        )}
                    </div>
                </div>
            </div>

            <div className="recipe-details__content">
                <section className="recipe-details__section">
                    <h2 className="recipe-details__heading">Інгредієнти</h2>
                    <ul className="recipe-details__ingredients">
                        {recipe.ingredients.map((ingredient) => (
                            <li key={ingredient}>{ingredient}</li>
                        ))}
                    </ul>
                </section>

                <section className="recipe-details__section">
                    <h2 className="recipe-details__heading">Приготування</h2>
                    <ol className="recipe-details__steps">
                        {recipe.instructions.map((step, index) => (
                            <li key={`${index}-${step}`}>{step}</li>
                        ))}
                    </ol>
                </section>
            </div>
        </article>
    )
}

interface RecipeDetailsContentProps {
    id: number
}

function RecipeDetailsContent({ id }: RecipeDetailsContentProps) {
    const customRecipe = useMyRecipesStore((state) => state.recipes.find((recipe) => recipe.id === id))
    const removeRecipe = useMyRecipesStore((state) => state.removeRecipe)
    const removeRecipeEntries = useMealPlanStore((state) => state.removeRecipeEntries)
    const showToast = useToastStore((state) => state.showToast)
    const navigate = useNavigate()
    const recipeQuery = useRecipe(id, !customRecipe)

    useDocumentTitle(customRecipe?.name ?? recipeQuery.data?.name ?? 'Рецепт')

    function handleDelete() {
        removeRecipe(id)
        removeRecipeEntries(id)
        showToast('Рецепт видалено', 'info')
        navigate('/my-recipes', { replace: true })
    }

    if (customRecipe) {
        return <RecipeDetails recipe={customRecipe} onDelete={handleDelete} />
    }

    if (recipeQuery.isPending) {
        return <StatusMessage variant="loading" title="Завантаження рецепта..." />
    }

    if (recipeQuery.isError) {
        return (
            <StatusMessage
                variant="error"
                title="Не вдалося завантажити рецепт"
                text={getErrorMessage(recipeQuery.error)}
                action={
                    <button type="button" className="recipe-details-page__retry" onClick={() => recipeQuery.refetch()}>
                        Спробувати ще
                    </button>
                }
            />
        )
    }

    return <RecipeDetails recipe={recipeQuery.data} />
}

function RecipeDetailsPage() {
    const { recipeId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const id = Number(recipeId)

    if (!Number.isInteger(id) || id <= 0) {
        return <NotFoundPage />
    }

    function handleBack() {
        if (location.key !== 'default') {
            navigate(-1)
        } else {
            navigate('/recipes')
        }
    }

    return (
        <section className="recipe-details-page">
            <button type="button" className="recipe-details-page__back" onClick={handleBack}>
                ← Назад
            </button>
            <RecipeDetailsContent key={id} id={id} />
        </section>
    )
}

export default RecipeDetailsPage