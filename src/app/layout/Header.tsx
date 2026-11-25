import { Link, NavLink } from 'react-router'
import ThemeToggle from '../../features/theme/ThemeToggle'
import './Header.scss'

function getLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link ${isActive ? 'header__link--active' : ''}`
}

function Header() {
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
                <ThemeToggle />
            </nav>
        </header>
    )
}

export default Header