import { PaginationMeta } from './types'

interface TablePaginationProps {
    meta: PaginationMeta
    itemLabel?: string
    onPageChange?: (page: number) => void
}

export default function TablePagination({
    meta,
    itemLabel = 'items',
    onPageChange,
}: TablePaginationProps) {
    const { total, currentPage, perPage } = meta || {total: 0, currentPage: 0, perPage: 0}
    const startItem = (currentPage - 1) * perPage + 1
    const endItem = Math.min(currentPage * perPage, total)
    const hasPrevious = currentPage > 1
    const hasNext = endItem < total

    const handlePrevious = () => {
        if (hasPrevious && onPageChange) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (hasNext && onPageChange) {
            onPageChange(currentPage + 1)
        }
    }

    return (
        <div className="flex items-center justify-between border-t border-[var(--color-admin-border-light)] px-6 py-4 dark:border-[var(--color-admin-border-dark)]">
            <span className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                Showing {startItem} - {endItem} of {total} {itemLabel}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    className="flex h-8 items-center justify-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 text-sm font-medium text-[var(--color-admin-text-secondary-light)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)]"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="flex h-8 items-center justify-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 text-sm font-medium text-[var(--color-admin-text-secondary-light)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)]"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
