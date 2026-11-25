import { Link } from 'react-router'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import './NotFoundPage.scss'

function NotFoundPage() {
    useDocumentTitle('Сторінку не знайдено')

    return (
        <section className="not-found-page">
            <p className="not-found-page__code">404</p>
            <h1 className="not-found-page__title">Сторінку не знайдено</h1>
            <p className="not-found-page__text">Такої адреси не існує або її було змінено.</p>
            <Link className="not-found-page__link" to="/recipes">
                До рецептів
            </Link>
        </section>
    )
}

export default NotFoundPage