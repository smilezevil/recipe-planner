import { useToastStore } from '../../../shared/model/toastStore'
import { useFavoritesStore } from '../model/favoritesStore'
import './FavoriteButton.scss'

interface FavoriteButtonProps {
    recipeId: number
    recipeName: string
    variant?: 'icon' | 'full'
}

function FavoriteButton({ recipeId, recipeName, variant = 'icon' }: FavoriteButtonProps) {
    const isFavorite = useFavoritesStore((state) => state.ids.includes(recipeId))
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
    const showToast = useToastStore((state) => state.showToast)

    function handleClick() {
        const isAdded = toggleFavorite(recipeId)
        showToast(isAdded ? `«${recipeName}» додано в обране` : `«${recipeName}» прибрано з обраного`, 'info')
    }

    const label = isFavorite ? 'Прибрати з обраного' : 'Додати в обране'

    return (
        <button
            type="button"
            className={`favorite-button favorite-button--${variant} ${isFavorite ? 'favorite-button--active' : ''}`}
            onClick={handleClick}
            aria-pressed={isFavorite}
            aria-label={variant === 'icon' ? label : undefined}
        >
            <span aria-hidden="true">{isFavorite ? '❤️' : '🤍'}</span>
            {variant === 'full' && <span>{isFavorite ? 'В обраному' : 'В обране'}</span>}
        </button>
    )
}

export default FavoriteButton