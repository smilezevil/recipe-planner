import { Link } from 'react-router'
import RecipeCard from '../features/recipes/components/RecipeCard'
import RecipeGrid from '../features/recipes/components/RecipeGrid'
import { useMyRecipesStore } from '../features/recipes/model/myRecipesStore'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import StatusMessage from '../shared/ui/StatusMessage'
import './MyRecipesPage.scss'

function MyRecipesPage() {
    const recipes = useMyRecipesStore((state) => state.recipes)

    useDocumentTitle('Мої рецепти')

    return (
        <section className="my-recipes-page">
            <div className="my-recipes-page__header">
                <div>
                    <h1 className="my-recipes-page__title">Мої рецепти</h1>
                    <p className="my-recipes-page__subtitle">Власні рецепти зберігаються у вашому браузері</p>
                </div>
                <Link className="my-recipes-page__add" to="/recipes/new">
                    + Новий рецепт
                </Link>
            </div>

            {recipes.length === 0 ? (
                <StatusMessage
                    variant="empty"
                    title="Ви ще не додали жодного рецепта"
                    text="Створіть свій перший рецепт — він зʼявиться тут."
                />
            ) : (
                <RecipeGrid>
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </RecipeGrid>
            )}
        </section>
    )
}

export default MyRecipesPage