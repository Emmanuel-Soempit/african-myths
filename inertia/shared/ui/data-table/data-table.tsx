import { DataTableProps } from './types'
import TableHeader from './table-header'
import TablePagination from './table-pagination'

export default function DataTable<T>({
    columns,
    data,
    meta,
    title,
    totalLabel = 'items',
    onPageChange,
    onSort,
    sortBy,
    sortOrder,
    renderActions,
    filters,
    getRowKey,
}: DataTableProps<T>) {
    return (
        <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
            <TableHeader
                title={title}
                totalCount={meta?.total}
                filters={filters}
            />

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        <tr className="border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                            {columns?.map((column) => {
                                const isActive = sortBy === column.key
                                const isSortable = column.sortable !== false

                                return (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-3 font-medium ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''} ${column.headerClassName || ''}`}
                                        scope="col"
                                    >
                                        {isSortable ? (
                                            <button
                                                onClick={() => onSort?.(column.key)}
                                                className={`flex items-center gap-2 transition-colors ${isActive
                                                        ? 'text-[var(--color-admin-primary)]'
                                                        : 'hover:text-[var(--color-admin-primary)]'
                                                    }`}
                                            >
                                                <span>{column.header}</span>
                                                <span className="flex flex-col">
                                                    <span
                                                        className={`material-symbols-outlined text-[10px] leading-none -mb-0.5 ${isActive && sortOrder === 'asc'
                                                                ? 'opacity-100'
                                                                : 'opacity-30'
                                                            }`}
                                                    >
                                                        arrow_drop_up
                                                    </span>
                                                    <span
                                                        className={`material-symbols-outlined text-[10px] leading-none ${isActive && sortOrder === 'desc'
                                                                ? 'opacity-100'
                                                                : 'opacity-30'
                                                            }`}
                                                    >
                                                        arrow_drop_down
                                                    </span>
                                                </span>
                                            </button>
                                        ) : (
                                            column.header
                                        )}
                                    </th>
                                )
                            })}
                            {renderActions && (
                                <th
                                    className="px-6 py-3 font-medium text-right"
                                    scope="col"
                                >
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {data?.map((item, index) => {
                            const isLastRow = index === data.length - 1
                            return (
                                <tr
                                    key={getRowKey(item, index)}
                                    className={
                                        !isLastRow
                                            ? 'border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]'
                                            : ''
                                    }
                                >
                                    {columns.map((column) => {
                                        const value = column.accessor(item)
                                        return (
                                            <td
                                                key={column.key}
                                                className={`px-6 py-4 ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''} ${column.className || ''}`}
                                            >
                                                {column.render
                                                    ? column.render(value, item, index)
                                                    : value}
                                            </td>
                                        )
                                    })}
                                    {renderActions && (
                                        <td className="px-6 py-4 text-right">
                                            {renderActions(item, index)}
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <TablePagination
                meta={meta}
                itemLabel={totalLabel}
                onPageChange={onPageChange}
            />
        </div>
    )
}
