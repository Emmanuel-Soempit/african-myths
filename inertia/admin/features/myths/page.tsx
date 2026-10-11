import { router } from '@inertiajs/react'
import { DataTable, Column } from '~/shared/ui/data-table'
import { TableData } from '~/types'
import Myth from '#models/myth'
import Button from '~/shared/ui/button'

interface AdminMythsPageProps {
    myths: TableData<Myth[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    cultureId: string
}

export default function AdminMythsPage({ myths, sortBy, sortOrder, cultureId }: AdminMythsPageProps) {
    console.log('Cultrue', cultureId)

    const handleSort = (columnKey: string) => {
        const newSortOrder =
            sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc'

        router.visit(`/admin/cultures/${cultureId}/myths`, {
            data: {
                sortBy: columnKey,
                sortOrder: newSortOrder,
                page: myths.meta?.currentPage || 1,
            },
            preserveState: true,
            preserveScroll: true,
        })
    }

    const columns: Column<Myth>[] = [
        {
            key: 'title',
            header: 'Title',
            sortable: true,
            accessor: (myth) => (myth as any).name ?? '—',
            render: (_value, myth) => (
                <div className="flex items-center gap-3">
                    {(myth as any).thumbnail && (
                        <div
                            className="aspect-square size-10 rounded-lg bg-cover bg-center bg-no-repeat shrink-0"
                            style={{ backgroundImage: `url('${(myth as any).thumbnail}')` }}
                        />
                    )}
                    <p className="font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {(myth as any).name ?? '—'}
                    </p>
                </div>
            ),
        },
        {
            key: 'culture',
            header: 'Culture',
            accessor: (myth) => (myth as any).culture?.name ?? '—',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'author',
            header: 'Author',
            accessor: (myth) => {
                const profile = (myth as any).author?.profile
                if (!profile) return '—'
                return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—'
            },
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (myth) => myth.status ?? '—',
            render: (value) => {
                const status = String(value)
                const colourMap: Record<string, string> = {
                    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
                    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                }
                return (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${colourMap[status] ?? colourMap.draft}`}>
                        {status}
                    </span>
                )
            },
        },
        {
            key: 'createdAt',
            header: 'Date Added',
            accessor: (myth) =>
                myth.createdAt
                    ? new Date(myth.createdAt as any).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    })
                    : '—',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
    ]

    const renderActions = (myth: Myth) => (
        <div className="flex justify-end gap-1">
            <button
                onClick={() => router.visit(`/myths/${myth.id}`)}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                title="View"
            >
                <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
            <button
                onClick={() => router.visit(`/admin/cultures/${cultureId}/myths/${myth.id}/edit`)}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                title="Edit"
            >
                <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <button
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                title="Delete"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
            </button>
        </div>
    )

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Manage Myths
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        View, edit, and add new myths to the platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary"
                        className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm"
                        onClick={() => router.visit(`/admin/cultures/${cultureId}/myths/create`)}
                    >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        <span className="truncate">Add New Myth</span>
                    </Button>
                </div>
            </div>

            {/* Myths Table */}
            <div className="mt-8">
                <DataTable<Myth>
                    columns={columns}
                    data={myths.data}
                    meta={myths.meta}
                    title="All Myths"
                    totalLabel="myths"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    renderActions={renderActions}
                    getRowKey={(myth) => myth.id}
                />
            </div>
        </>
    )
}
