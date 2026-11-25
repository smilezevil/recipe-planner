import './Pagination.scss'

interface PaginationProps {
    page: number
    totalPages: number
    isDisabled?: boolean
    onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, isDisabled = false, onPageChange }: PaginationProps) {
    return (
        <nav className="pagination" aria-label="Сторінки">
            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(page - 1)}
                disabled={isDisabled || page <= 1}
            >
                ← Попередня
            </button>

            <span className="pagination__info">
        Сторінка {page} з {totalPages}
      </span>

            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(page + 1)}
                disabled={isDisabled || page >= totalPages}
            >
                Наступна →
            </button>
        </nav>
    )
}

export default Pagination