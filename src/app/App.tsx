import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './layout/AppLayout'

const RecipesPage = lazy(() => import('../pages/RecipesPage'))
const RecipeDetailsPage = lazy(() => import('../pages/RecipeDetailsPage'))
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'))
const MealPlanPage = lazy(() => import('../pages/MealPlanPage'))
const NewRecipePage = lazy(() => import('../pages/NewRecipePage'))
const MyRecipesPage = lazy(() => import('../pages/MyRecipesPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/recipes" replace />} />
                <Route path="recipes" element={<RecipesPage />} />
                <Route path="recipes/new" element={<NewRecipePage />} />
                <Route path="recipes/:recipeId" element={<RecipeDetailsPage />} />
                <Route path="my-recipes" element={<MyRecipesPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="meal-plan" element={<MealPlanPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default App