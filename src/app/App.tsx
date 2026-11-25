import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './layout/AppLayout'

const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/recipes" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default App