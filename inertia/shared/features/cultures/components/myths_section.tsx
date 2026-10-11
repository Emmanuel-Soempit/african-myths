interface MythsSectionProps {
    stats: {
        totalMyths: number
        deityStories: number
        creationMyths: number
    }
}

export default function MythsSection({ stats }: MythsSectionProps) {
    return (
        <section className="mb-12 scroll-mt-24" id="myths">
            <div className="mb-6 flex items-center justify-between border-b border-[var(--color-admin-border-light)] pb-4 dark:border-[var(--color-admin-border-dark)]">
                <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.015em] text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Myths & Legends
                </h2>
                <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--color-admin-primary)]/20 px-4 text-sm font-bold leading-normal tracking-[-0.01em] text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary)]/30">
                    <span className="material-symbols-outlined !text-xl">
                        settings
                    </span>
                    <span className="truncate">Manage Myths</span>
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <p className="text-sm font-medium leading-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Total Myths
                    </p>
                    <p className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {stats.totalMyths}
                    </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <p className="text-sm font-medium leading-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Deity Stories
                    </p>
                    <p className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {stats.deityStories}
                    </p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                    <p className="text-sm font-medium leading-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Creation Myths
                    </p>
                    <p className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {stats.creationMyths}
                    </p>
                </div>
            </div>
        </section>
    )
}
