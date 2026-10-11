import { ReactNode } from 'react'

interface TableHeaderProps {
    title?: string
    totalCount?: number
    filters?: ReactNode
}

export default function TableHeader({
    title,
    totalCount,
    filters,
}: TableHeaderProps) {
    if (!title && !filters) return null

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-admin-border-light)] p-6 dark:border-[var(--color-admin-border-dark)]">
            {title && (
                <h2 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    {title}
                    {totalCount !== undefined && ` (${totalCount})`}
                </h2>
            )}
            {filters && <div className="flex items-center gap-2">{filters}</div>}
        </div>
    )
}
