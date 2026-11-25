import type { ReactNode } from 'react'
import './RecipeGrid.scss'

interface RecipeGridProps {
    children: ReactNode
    isDimmed?: boolean
}

function RecipeGrid({ children, isDimmed = false }: RecipeGridProps) {
    return <div className={`recipe-grid ${isDimmed ? 'recipe-grid--dimmed' : ''}`}>{children}</div>
}

export default RecipeGrid