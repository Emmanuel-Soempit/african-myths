import { useState } from 'react'
import { router } from '@inertiajs/react'
import { DataTable, Column } from '~/shared/ui/data-table'
import { TableData } from '~/types'
import Culture from '#models/culture'
import Button from '~/shared/ui/button'
import AddCultureModal from './components/add_culture_modal'
import ConfirmDeleteModal from '~/shared/ui/confirm_delete_modal'
import toast from 'react-hot-toast'
import useDashboardContext from '~/shared/hooks/use_dashboard_context'

interface AdminCulturesPageProps {
    cultures: TableData<Culture[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminCulturesPage({
    cultures,
    sortBy,
    sortOrder,
}: AdminCulturesPageProps) {
    const { basePath, apiBase, can } = useDashboardContext()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [cultureToDelete, setCultureToDelete] = useState<Culture | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleSort = (columnKey: string) => {
        const newSortOrder =
            sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc'

        router.visit(`${basePath}/cultures`, {
            data: {
                sortBy: columnKey,
                sortOrder: newSortOrder,
                page: cultures.meta?.currentPage || 1,
            },
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleDeleteConfirm = () => {
        if (!cultureToDelete) return
        setIsDeleting(true)
        router.delete(`${apiBase}/cultures/${cultureToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Culture deleted')
                setIsDeleteModalOpen(false)
                setCultureToDelete(null)
            },
            onError: () => {
                toast.error('Failed to delete culture')
            },
            onFinish: () => {
                setIsDeleting(false)
            },
        })
    }

    const columns: Column<Culture>[] = [
        {
            key: 'name',
            header: 'Culture Name',
            sortable: true,
            accessor: (culture) => (culture as any).name ?? '—',
            render: (_value, culture) => (
                <div className="flex items-center gap-4">
                    <div
                        className="aspect-square size-10 rounded-lg bg-cover bg-center bg-no-repeat shrink-0"
                        style={{
                            backgroundImage: culture.thumbnail
                                ? `url('${culture.thumbnail}')`
                                : undefined,
                            backgroundColor: culture.thumbnail ? undefined : 'var(--color-admin-border-light)',
                        }}
                    />
                    <p className="font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {culture.name}
                    </p>
                </div>
            ),
        },
        {
            key: 'ethnicGroup',
            header: 'Ethnic Group',
            accessor: (culture) => (culture as any).ethnicGroup?.canonicalName ?? '—',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (culture) => culture.status ?? '—',
            render: (value) => {
                const status = String(value)
                const colourMap: Record<string, string> = {
                    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
                    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                }
                return (
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colourMap[status] || 'bg-gray-100 text-gray-800'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                )
            },
        },
        {
            key: 'createdAt',
            header: 'Date Added',
            accessor: (culture) =>
                culture.createdAt
                    ? new Date(culture.createdAt as any).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    })
                    : '—',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
    ]

    const renderActions = (culture: Culture) => (
        <div className="flex justify-end gap-1">
            <button
                onClick={() => router.visit(`${basePath}/cultures/${culture.id}`)}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                title="View"
            >
                <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
            <button
                onClick={() => router.visit(`${basePath}/cultures/${culture.id}/edit`)}
                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                title="Edit"
            >
                <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            {can.delete && (
                <button
                    onClick={() => {
                        setCultureToDelete(culture)
                        setIsDeleteModalOpen(true)
                    }}
                    className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            )}
        </div>
    )

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Manage Cultures
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        View, edit, and add new cultures to the platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary"
                        className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        <span className="truncate">Add New Culture</span>
                    </Button>
                </div>
            </div>

            {/* Cultures Table */}
            <div className="mt-8">
                <DataTable<Culture>
                    columns={columns}
                    data={cultures.data}
                    meta={cultures.meta}
                    title="All Cultures"
                    totalLabel="cultures"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    renderActions={renderActions}
                    getRowKey={(culture) => culture.id}
                />
            </div>

            <AddCultureModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {can.delete && (
                <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                name={(cultureToDelete as any)?.name ?? ''}
                loading={isDeleting}
                onNo={() => {
                    if (isDeleting) return
                    setIsDeleteModalOpen(false)
                    setCultureToDelete(null)
                }}
                onYes={handleDeleteConfirm}
                />
            )}
        </>
    )
}
