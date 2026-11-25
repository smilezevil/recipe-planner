import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { DIFFICULTY_LABELS } from '../lib/labels'
import type { Recipe } from '../model/types'
import './RecipeCard.scss'

interface RecipeCardProps {
    recipe: Recipe
    actions?: ReactNode
    onPrefetch?: (id: number) => void
}

function RecipeCard({ recipe, actions, onPrefetch }: RecipeCardProps) {
    const link = `/recipes/${recipe.id}`

    function handlePrefetch() {
        if (!recipe.isCustom) {
            onPrefetch?.(recipe.id)
        }
    }

    return (
        <article className="recipe-card">
            <Link
                className="recipe-card__media"
                to={link}
                onMouseEnter={handlePrefetch}
                onFocus={handlePrefetch}
                tabIndex={-1}
                aria-hidden="true"
            >
                {recipe.image ? (
                    <img className="recipe-card__image" src={recipe.image} alt="" loading="lazy" />
                ) : (
                    <span className="recipe-card__placeholder">🍽️</span>
                )}
            </Link>

            {actions && <div className="recipe-card__actions">{actions}</div>}

            <div className="recipe-card__body">
                <div className="recipe-card__meta">
                    <span className="recipe-card__cuisine">{recipe.cuisine}</span>
                    <span className={`recipe-card__difficulty recipe-card__difficulty--${recipe.difficulty.toLowerCase()}`}>
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
                </div>

                <h3 className="recipe-card__title">
                    <Link className="recipe-card__link" to={link} onMouseEnter={handlePrefetch} onFocus={handlePrefetch}>
                        {recipe.name}
                    </Link>
                </h3>

                <ul className="recipe-card__stats">
                    <li>⏱ {recipe.totalTimeMinutes} хв</li>
                    <li>🔥 {recipe.caloriesPerServing} ккал</li>
                    {!recipe.isCustom && <li>⭐ {recipe.rating.toFixed(1)}</li>}
                </ul>
            </div>
        </article>
    )
}

export default RecipeCard