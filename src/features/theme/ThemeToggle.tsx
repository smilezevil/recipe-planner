import { useThemeStore } from './themeStore'
import './ThemeToggle.scss'

function ThemeToggle() {
    const theme = useThemeStore((state) => state.theme)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)
    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            aria-pressed={isDark}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    )
}

export default ThemeToggle