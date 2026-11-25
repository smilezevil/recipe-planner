import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { useThemeStore } from '../../features/theme/themeStore'
import StatusMessage from '../../shared/ui/StatusMessage'
import Toaster from '../../shared/ui/Toaster'
import Header from './Header'
import './AppLayout.scss'

function AppLayout() {
    const theme = useThemeStore((state) => state.theme)

    return (
        <div className={`app-layout ${theme === 'dark' ? 'app-layout--dark' : ''}`}>
            <div className="app-layout__container">
                <Header />

                <main className="app-layout__main">
                    <Suspense fallback={<StatusMessage variant="loading" title="Завантаження сторінки..." />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            <Toaster />
        </div>
    )
}

export default AppLayout