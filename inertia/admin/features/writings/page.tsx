import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { DataTable, Column } from '~/shared/ui/data-table'
import { TableData } from '~/types'
import { Writing } from '~/types/writing'
import Select from '~/shared/ui/select'
import ConfirmDeleteModal from '~/shared/ui/confirm_delete_modal'
import useUtils from '~/shared/hooks/use_utils'
import toast from 'react-hot-toast'

interface AdminWritingsPageProps {
    writings: TableData<Writing[]>
    filters: { type: string; status: string; cultureId: string }
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
    { value: 'pending', label: 'Pending' },
    { value: 'draft', label: 'Draft' },
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

export default function AdminWritingsPage({ writings, filters }: AdminWritingsPageProps) {
    const { loadCultureOptions } = useUtils()
    const [writingToDelete, setWritingToDelete] = useState<Writing | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const visit = (data: Record<string, string | number>) => {
        router.visit('/admin/writings', {
            data: { type: filters.type, status: filters.status, cultureId: filters.cultureId, ...data },
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleDeleteConfirm = () => {
        if (!writingToDelete) return
        setIsDeleting(true)
        router.delete(`/api/v1/admin/writings/${writingToDelete.id}`, {
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
            key: 'author',
            header: 'Author',
            accessor: (w) => {
                const profile = (w as any).author?.profile
                if (!profile) return '—'
                return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—'
            },
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
            header: 'Submitted / Updated',
            accessor: (w) => formatDate(w.updatedAt),
            className: 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]',
        },
    ]

    const renderActions = (writing: Writing) => (
        <div className="flex justify-end gap-1">
            <Link
                href={`/admin/writings/${writing.id}`}
                className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                title="Review"
            >
                <span className="material-symbols-outlined text-xl">
                    {writing.status === 'pending' ? 'rate_review' : 'visibility'}
                </span>
            </Link>
            <button
                onClick={() => setWritingToDelete(writing)}
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
                        Manage Writings
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Review author submissions — poems, stories and articles. Pending items appear first.
                    </p>
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
                            <div className="w-40">
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
                            <div className="w-40">
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
                            <div className="w-56">
                                <Select
                                    name="cultureId"
                                    variant="admin-primary"
                                    placeholder="All cultures"
                                    errors={{}}
                                    setError={() => { }}
                                    isAsync={true}
                                    loadOptions={loadCultureOptions}
                                    onChange={(e) => visit({ cultureId: e.target.value, page: 1 })}
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
