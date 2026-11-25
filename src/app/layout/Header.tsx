import { Link, NavLink } from 'react-router'
import { useFavoritesStore } from '../../features/favorites/model/favoritesStore'
import { useMealPlanStore } from '../../features/meal-plan/model/mealPlanStore'
import ThemeToggle from '../../features/theme/ThemeToggle'
import './Header.scss'

function getLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link ${isActive ? 'header__link--active' : ''}`
}

function Header() {
    const favoritesCount = useFavoritesStore((state) => state.ids.length)
    const planCount = useMealPlanStore((state) => state.entries.length)

    return (
        <header className="header">
            <Link className="header__brand" to="/recipes">
        <span className="header__logo" aria-hidden="true">
          🍳
        </span>
                <span className="header__title">Recipe Planner</span>
            </Link>

            <nav className="header__nav" aria-label="Головна навігація">
                <NavLink className={getLinkClass} to="/recipes" end>
                    Рецепти
                </NavLink>
                <NavLink className={getLinkClass} to="/favorites">
                    Обране
                    {favoritesCount > 0 && <span className="header__badge">{favoritesCount}</span>}
                </NavLink>
                <NavLink className={getLinkClass} to="/meal-plan">
                    План
                    {planCount > 0 && <span className="header__badge">{planCount}</span>}
                </NavLink>
                <ThemeToggle />
            </nav>
        </header>
    )
}

export default Header