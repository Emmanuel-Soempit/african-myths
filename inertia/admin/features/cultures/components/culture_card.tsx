import { AdminCulture } from '../types'

interface CultureCardProps {
    culture: AdminCulture
}

export default function CultureCard({ culture }: CultureCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] transition-shadow hover:shadow-lg">
            {/* Thumbnail */}
            <div className="aspect-video w-full overflow-hidden">
                <img
                    alt={culture.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={culture.thumbnail}
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {culture.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            {culture.region}
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${culture.status === 'Published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                    >
                        {culture.status}
                    </span>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                            auto_stories
                        </span>
                        <span>{culture.mythsCount} myths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                            schedule
                        </span>
                        <span>{culture.lastUpdated}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-4 py-2 text-sm font-medium text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-gray-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-white/5">
                        <span className="material-symbols-outlined text-base">
                            edit
                        </span>
                        Edit
                    </button>
                    <button className="flex items-center justify-center rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-2 text-[var(--color-admin-text-secondary-light)] transition-colors hover:bg-red-50 hover:text-red-600 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-red-900/20 dark:hover:text-red-400">
                        <span className="material-symbols-outlined text-base">
                            delete
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
