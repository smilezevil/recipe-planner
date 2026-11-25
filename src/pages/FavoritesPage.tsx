import { Link } from 'react-router'
import FavoriteButton from '../features/favorites/components/FavoriteButton'
import { useFavoritesStore } from '../features/favorites/model/favoritesStore'
import RecipeCard from '../features/recipes/components/RecipeCard'
import RecipeGrid from '../features/recipes/components/RecipeGrid'
import { useRecipesByIds } from '../features/recipes/hooks/useRecipe'
import { getErrorMessage } from '../shared/api/errors'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import StatusMessage from '../shared/ui/StatusMessage'
import './FavoritesPage.scss'

function FavoritesPage() {
    const ids = useFavoritesStore((state) => state.ids)
    const { recipes, isPending, error, retryFailed } = useRecipesByIds(ids)

    useDocumentTitle('Обране')

    function renderContent() {
        if (ids.length === 0) {
            return (
                <StatusMessage
                    variant="empty"
                    title="В обраному поки порожньо"
                    text="Натисніть 🤍 на картці рецепта, щоб зберегти його тут."
                    action={
                        <Link className="favorites-page__link" to="/recipes">
                            До каталогу
                        </Link>
                    }
                />
            )
        }

        if (isPending && recipes.length === 0) {
            return <StatusMessage variant="loading" title="Завантаження обраного..." />
        }

        return (
            <>
                {error && (
                    <StatusMessage
                        variant="error"
                        title="Частину рецептів не вдалося завантажити"
                        text={getErrorMessage(error)}
                        action={
                            <button type="button" className="favorites-page__retry" onClick={retryFailed}>
                                Спробувати ще
                            </button>
                        }
                    />
                )}

                <RecipeGrid>
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            actions={<FavoriteButton recipeId={recipe.id} recipeName={recipe.name} />}
                        />
                    ))}
                </RecipeGrid>
            </>
        )
    }

    return (
        <section className="favorites-page">
            <div>
                <h1 className="favorites-page__title">Обране</h1>
                <p className="favorites-page__subtitle">Збережено рецептів: {ids.length}</p>
            </div>
            {renderContent()}
        </section>
    )
}

export default FavoritesPage