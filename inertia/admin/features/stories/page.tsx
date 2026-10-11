import { router } from '@inertiajs/react'
import { ADMIN_STORIES } from './utils/dummy'
import Button from '~/shared/ui/button'

export default function AdminStoriesPage() {
    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Manage Stories
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        View, edit, and add new cultural stories to the platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="admin-primary" className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm">
                        <span className="material-symbols-outlined text-base">
                            add_circle
                        </span>
                        <span className="truncate">Add New Story</span>
                    </Button>
                </div>
            </div>

            {/* Stories Table */}
            <div className="mt-8 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs uppercase text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            <tr className="border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                                <th className="px-6 py-4 font-medium" scope="col">
                                    Title
                                </th>
                                <th className="px-6 py-4 font-medium" scope="col">
                                    Culture
                                </th>
                                <th className="px-6 py-4 font-medium" scope="col">
                                    Author
                                </th>
                                <th className="px-6 py-4 font-medium" scope="col">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-medium" scope="col">
                                    Date Added
                                </th>
                                <th
                                    className="px-6 py-4 font-medium text-right"
                                    scope="col"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {ADMIN_STORIES.map((story, index) => (
                                <tr
                                    key={story.id}
                                    className={
                                        index < ADMIN_STORIES.length - 1
                                            ? 'border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]'
                                            : ''
                                    }
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {story.title}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                        {story.culture}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                        {story.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${story.status === 'Published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : story.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}
                                        >
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                        {story.dateAdded}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    router.visit(`/stories/${story.id}`)
                                                }}
                                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                                <span className="material-symbols-outlined text-xl">
                                                    visibility
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    router.visit(`/admin/stories/${story.id}/edit`)
                                                }}
                                                className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                                <span className="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                            </button>
                                            <button className="h-8 w-8 text-[var(--color-admin-text-secondary-light)] hover:text-red-500 dark:text-[var(--color-admin-text-secondary-dark)]">
                                                <span className="material-symbols-outlined text-xl">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-[var(--color-admin-border-light)] p-4 dark:border-[var(--color-admin-border-dark)]">
                    <span className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Showing 1 to 5 of 5 entries
                    </span>
                    <div className="inline-flex items-center gap-2">
                        <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] text-sm font-medium text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 disabled:opacity-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10"
                            disabled
                        >
                            <span className="material-symbols-outlined text-lg">
                                chevron_left
                            </span>
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-admin-primary)] bg-[#E88D39]/20 text-sm font-medium text-[var(--color-admin-primary)]">
                            1
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] text-sm font-medium text-[var(--color-admin-text-secondary-light)] hover:bg-gray-100 disabled:opacity-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/10">
                            <span className="material-symbols-outlined text-lg">
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
