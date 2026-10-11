import { Link } from '@inertiajs/react'
import { ContentStatus, WritingType } from '~/types/writing'

interface AuthorDashboardProps {
    stats: {
        byType: Record<WritingType, number>
        byStatus: Record<ContentStatus, number>
    }
    recent: any[]
    rejected: any[]
}

const STATUS_STYLES: Record<string, string> = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
            {status}
        </span>
    )
}

function formatDate(value?: string | null) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
}

export default function AuthorDashboardPage({ stats, recent, rejected }: AuthorDashboardProps) {
    const typeCards: Array<{ label: string; type: WritingType; icon: string }> = [
        { label: 'Poems', type: 'poem', icon: 'edit_note' },
        { label: 'Stories', type: 'story', icon: 'auto_stories' },
        { label: 'Articles', type: 'article', icon: 'article' },
    ]
    const statusCards: Array<{ label: string; status: ContentStatus }> = [
        { label: 'Drafts', status: 'draft' },
        { label: 'In review', status: 'pending' },
        { label: 'Published', status: 'published' },
        { label: 'Rejected', status: 'rejected' },
    ]

    return (
        <div className="space-y-10">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Author Dashboard
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Write poems, stories and articles, then submit them for review.
                    </p>
                </div>
                <div className="flex gap-2">
                    {typeCards.map((t) => (
                        <Link
                            key={t.type}
                            href={`/author/writings/create?type=${t.type}`}
                            className="flex h-10 items-center gap-2 rounded-lg bg-[var(--color-admin-primary)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                        >
                            <span className="material-symbols-outlined text-base">{t.icon}</span>
                            <span>New {t.label.slice(0, -1)}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {typeCards.map((t) => (
                    <Link
                        key={t.type}
                        href={`/author/writings?type=${t.type}`}
                        className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 transition-shadow hover:shadow-md dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-base font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                {t.label}
                            </p>
                            <span className="material-symbols-outlined text-[var(--color-admin-primary)]">
                                {t.icon}
                            </span>
                        </div>
                        <p className="font-display text-3xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {(stats?.byType?.[t.type] ?? 0).toLocaleString()}
                        </p>
                    </Link>
                ))}
                <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    {statusCards.map((s) => (
                        <div key={s.status} className="flex items-center justify-between">
                            <span className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                {s.label}
                            </span>
                            <span className="text-sm font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                {stats?.byStatus?.[s.status] ?? 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Needs attention */}
            {(rejected ?? []).length > 0 && (
                <section>
                    <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Needs attention
                    </h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {rejected.map((w) => (
                            <div
                                key={w.id}
                                className="rounded-xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/20"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                            {w.title}
                                        </p>
                                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                            {w.reviewNote || 'Rejected without a note.'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/author/writings/${w.id}/edit`}
                                        className="flex h-9 items-center gap-2 rounded-lg bg-[var(--color-admin-primary)] px-4 text-sm font-bold text-white"
                                    >
                                        <span className="material-symbols-outlined text-base">edit</span>
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent writings */}
            <section>
                <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Recent writings
                </h2>
                <div className="mt-4 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    {(recent ?? []).length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Nothing written yet. Start with a poem, story or article.
                        </p>
                    ) : (
                        <div className="divide-y divide-[var(--color-admin-border-light)] dark:divide-[var(--color-admin-border-dark)]">
                            {recent.map((w) => (
                                <Link
                                    key={w.id}
                                    href={`/author/writings/${w.id}/edit`}
                                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                            {w.title}
                                        </span>
                                        <span className="text-xs capitalize text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                            {w.type} · {formatDate(w.updatedAt)}
                                        </span>
                                    </div>
                                    <StatusBadge status={w.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
