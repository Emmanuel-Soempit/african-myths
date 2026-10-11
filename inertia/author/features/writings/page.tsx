import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { DataTable, Column } from '~/shared/ui/data-table'
import { TableData } from '~/types'
import { Writing } from '~/types/writing'
import Button from '~/shared/ui/button'
import Select from '~/shared/ui/select'
import ConfirmDeleteModal from '~/shared/ui/confirm_delete_modal'
import toast from 'react-hot-toast'

interface AuthorWritingsPageProps {
    writings: TableData<Writing[]>
    filters: { type: string; status: string }
}

const STATUS_STYLES: Record<string, string> = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const TYPE_OPTIONS = [
    { value: '', label: 'All types' },
    { value: 'poem', label: 'Poems' },
    { value: 'story', label: 'Stories' },
    { value: 'article', label: 'Articles' },
]

const STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'In review' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' },
]

function formatDate(value?: string | null) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
}

export default function AuthorWritingsPage({ writings, filters }: AuthorWritingsPageProps) {
    const [writingToDelete, setWritingToDelete] = useState<Writing | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const visit = (data: Record<string, string | number>) => {
        router.visit('/author/writings', {
            data: { type: filters.type, status: filters.status, ...data },
            preserveState: true,
            preserveScroll: true,
        })
    }

    const act = (action: 'submit' | 'withdraw', writing: Writing) => {
        router.post(`/api/v1/author/writings/${writing.id}/${action}`, {}, {
            preserveScroll: true,
            onError: () => toast.error('Action failed'),
        })
    }

    const handleDeleteConfirm = () => {
        if (!writingToDelete) return
        setIsDeleting(true)
        router.delete(`/api/v1/author/writings/${writingToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Writing deleted')
                setWritingToDelete(null)
            },
            onError: () => toast.error('Failed to delete writing'),
            onFinish: () => setIsDeleting(false),
        })
    }

    const columns: Column<Writing>[] = [
        {
            key: 'title',
            header: 'Title',
            accessor: (w) => w.title,
            render: (_v, w) => (
                <span className="font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    {w.title}
                </span>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            accessor: (w) => w.type,
            className: 'capitalize text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'culture',
            header: 'Culture',
            accessor: (w) => (w as any).culture?.name ?? '—',
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
        {
            key: 'status',
            header: 'Status',
            accessor: (w) => w.status,
            render: (value) => {
                const status = String(value)
                return (
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
                        {status}
                    </span>
                )
            },
        },
        {
            key: 'updatedAt',
            header: 'Updated',
            accessor: (w) => formatDate(w.updatedAt),
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
    ]

    const renderActions = (writing: Writing) => (
        <div className="flex justify-end gap-1">
            {(writing.status === 'draft' || writing.status === 'rejected') && (
                <>
                    <Link
                        href={`/author/writings/${writing.id}/edit`}
                        className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                        title="Edit"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </Link>
                    <button
                        onClick={() => act('submit', writing)}
                        className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                        title="Submit for review"
                    >
                        <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                </>
            )}
            {writing.status === 'draft' && (
                <button
                    onClick={() => setWritingToDelete(writing)}
                    className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            )}
            {writing.status === 'pending' && (
                <>
                    <Link
                        href={`/author/writings/${writing.id}/edit`}
                        className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                        title="View"
                    >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                    </Link>
                    <button
                        onClick={() => act('withdraw', writing)}
                        className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                        title="Withdraw"
                    >
                        <span className="material-symbols-outlined text-xl">undo</span>
                    </button>
                </>
            )}
            {writing.status === 'published' && (
                <a
                    href={`/writings/${writing.id}`}
                    className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                    title="View public page"
                >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                </a>
            )}
        </div>
    )

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        My Writings
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Your poems, stories and articles.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary"
                        className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm"
                        onClick={() => router.visit('/author/writings/create?type=story')}
                    >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        <span className="truncate">New writing</span>
                    </Button>
                </div>
            </div>

            {/* Writings Table */}
            <div className="mt-8">
                <DataTable<Writing>
                    columns={columns}
                    data={writings.data}
                    meta={writings.meta}
                    title="All Writings"
                    totalLabel="writings"
                    onPageChange={(page) => visit({ page })}
                    renderActions={renderActions}
                    getRowKey={(w) => w.id}
                    filters={
                        <div className="flex gap-3">
                            <div className="w-44">
                                <Select
                                    name="type"
                                    variant="admin-primary"
                                    errors={{}}
                                    setError={() => { }}
                                    options={TYPE_OPTIONS}
                                    value={filters.type}
                                    onChange={(e) => visit({ type: e.target.value, page: 1 })}
                                />
                            </div>
                            <div className="w-44">
                                <Select
                                    name="status"
                                    variant="admin-primary"
                                    errors={{}}
                                    setError={() => { }}
                                    options={STATUS_OPTIONS}
                                    value={filters.status}
                                    onChange={(e) => visit({ status: e.target.value, page: 1 })}
                                />
                            </div>
                        </div>
                    }
                />
            </div>

            <ConfirmDeleteModal
                isOpen={!!writingToDelete}
                name={writingToDelete?.title ?? ''}
                loading={isDeleting}
                onNo={() => {
                    if (isDeleting) return
                    setWritingToDelete(null)
                }}
                onYes={handleDeleteConfirm}
            />
        </>
    )
}
