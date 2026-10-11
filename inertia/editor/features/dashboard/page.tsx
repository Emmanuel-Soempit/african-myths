import { Link } from '@inertiajs/react'

interface SubmissionItem {
    id: string
    name: string
    status: string
    updatedAt?: string | null
    cultureId?: string
}

interface EditorDashboardProps {
    stats: {
        ethnicGroups: number
        cultures: number
        myths: number
        myPending: number
    }
    mySubmissions: {
        cultures: SubmissionItem[]
        myths: SubmissionItem[]
    }
    recentlyUpdated: {
        cultures: Array<SubmissionItem & { ethnicGroup?: { canonicalName?: string } }>
        myths: Array<SubmissionItem & { culture?: { name?: string } }>
    }
}

const STATUS_STYLES: Record<string, string> = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

function StatusBadge({ status }: { status: string }) {
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

export default function EditorDashboardPage({ stats, mySubmissions, recentlyUpdated }: EditorDashboardProps) {
    const statCards = [
        { label: 'Ethnic Groups', value: stats?.ethnicGroups ?? 0, icon: 'groups', href: '/editor/ethnic-groups' },
        { label: 'Cultures', value: stats?.cultures ?? 0, icon: 'public', href: '/editor/cultures' },
        { label: 'Myths', value: stats?.myths ?? 0, icon: 'auto_stories', href: '/editor/cultures' },
        { label: 'My Pending Items', value: stats?.myPending ?? 0, icon: 'pending_actions', href: '/editor/dashboard' },
    ]

    const myItems = [
        ...(mySubmissions?.cultures ?? []).map((c) => ({
            ...c,
            kind: 'Culture' as const,
            href: `/editor/cultures/${c.id}/edit`,
        })),
        ...(mySubmissions?.myths ?? []).map((m) => ({
            ...m,
            kind: 'Myth' as const,
            href: `/editor/cultures/${m.cultureId}/myths/${m.id}/edit`,
        })),
    ]
        .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
        .slice(0, 10)

    return (
        <div className="space-y-10">
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Editor Dashboard
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Maintain ethnic groups, cultures and myths. Your edits go to an admin for review.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/editor/cultures"
                        className="flex h-10 items-center gap-2 rounded-lg bg-[var(--color-admin-primary)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        <span>New culture</span>
                    </Link>
                    <Link
                        href="/editor/ethnic-groups"
                        className="flex h-10 items-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] px-4 text-sm font-bold text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-gray-100 dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-base">groups</span>
                        <span>Browse ethnic groups</span>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 transition-shadow hover:shadow-md dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-base font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                {stat.label}
                            </p>
                            <span className="material-symbols-outlined text-[var(--color-admin-primary)]">
                                {stat.icon}
                            </span>
                        </div>
                        <p className="font-display text-3xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {stat.value.toLocaleString()}
                        </p>
                    </Link>
                ))}
            </div>

            {/* My Submissions */}
            <section>
                <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    My submissions
                </h2>
                <div className="mt-4 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                <tr className="border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                                    <th className="px-6 py-4 font-medium" scope="col">Title</th>
                                    <th className="px-6 py-4 font-medium" scope="col">Type</th>
                                    <th className="px-6 py-4 font-medium" scope="col">Status</th>
                                    <th className="px-6 py-4 font-medium" scope="col">Updated</th>
                                    <th className="px-6 py-4 font-medium text-right" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                {myItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                            No drafts or submissions yet.
                                        </td>
                                    </tr>
                                )}
                                {myItems.map((item) => (
                                    <tr
                                        key={`${item.kind}-${item.id}`}
                                        className={`border-b border-[var(--color-admin-border-light)] last:border-0 dark:border-[var(--color-admin-border-dark)] ${item.status === 'rejected' ? 'bg-red-50/50 dark:bg-red-950/10' : ''}`}
                                    >
                                        <td className="px-6 py-4 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                            {item.kind}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                            {formatDate(item.updatedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={item.href}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-admin-primary)] hover:underline"
                                            >
                                                <span className="material-symbols-outlined text-base">edit</span>
                                                {item.status === 'rejected' ? 'Fix & resubmit' : 'Edit'}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Recently Updated */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <h3 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Recently updated cultures
                    </h3>
                    <div className="mt-4 flex flex-col gap-3">
                        {(recentlyUpdated?.cultures ?? []).length === 0 && (
                            <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                Nothing yet.
                            </p>
                        )}
                        {(recentlyUpdated?.cultures ?? []).map((c) => (
                            <Link
                                key={c.id}
                                href={`/editor/cultures/${c.id}`}
                                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                        {c.name}
                                    </span>
                                    <span className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                        {c.ethnicGroup?.canonicalName ?? '—'} · {formatDate(c.updatedAt)}
                                    </span>
                                </div>
                                <StatusBadge status={c.status} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <h3 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Recently updated myths
                    </h3>
                    <div className="mt-4 flex flex-col gap-3">
                        {(recentlyUpdated?.myths ?? []).length === 0 && (
                            <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                Nothing yet.
                            </p>
                        )}
                        {(recentlyUpdated?.myths ?? []).map((m) => (
                            <Link
                                key={m.id}
                                href={`/editor/cultures/${m.cultureId}/myths/${m.id}/edit`}
                                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                        {m.name}
                                    </span>
                                    <span className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                        {m.culture?.name ?? '—'} · {formatDate(m.updatedAt)}
                                    </span>
                                </div>
                                <StatusBadge status={m.status} />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
