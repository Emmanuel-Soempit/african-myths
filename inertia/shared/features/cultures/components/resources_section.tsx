interface Resource {
    title: string
    author: string
    type: string
    size: string
    coverUrl: string
}

interface ResourcesSectionProps {
    resources: Resource[]
}

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
    return (
        <section className="mb-12 scroll-mt-24" id="resources">
            <h2 className="mb-6 border-b border-[var(--color-admin-border-light)] pb-4 font-display text-3xl font-bold leading-tight tracking-[-0.015em] text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                Resources & Downloads
            </h2>
            <div className="space-y-4">
                {resources.map((resource, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-4 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]"
                    >
                        <div
                            className="h-20 w-16 flex-shrink-0 rounded-lg bg-stone-700 bg-cover bg-center"
                            data-alt={`Book cover: ${resource.title}`}
                            style={{
                                backgroundImage: `url('${resource.coverUrl}')`,
                            }}
                        ></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                {resource.title}
                            </h3>
                            <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                by {resource.author}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-admin-text-secondary-light)]/80 dark:text-[var(--color-admin-text-secondary-dark)]/80">
                                {resource.type} / {resource.size}
                            </p>
                        </div>
                        <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--color-admin-primary)]/20 px-4 text-sm font-bold leading-normal text-[var(--color-admin-primary)]">
                            <span className="material-symbols-outlined !text-xl">
                                download
                            </span>
                            <span className="hidden truncate sm:inline">
                                Download
                            </span>
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
                <button className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-6 text-base font-bold leading-normal tracking-[-0.01em] text-[var(--color-admin-text-primary-light)] hover:bg-[var(--color-admin-border-light)]/50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-border-dark)]/50">
                    <span className="material-symbols-outlined !text-2xl">
                        menu_book
                    </span>
                    <span className="truncate">Manage Books</span>
                </button>
            </div>
        </section>
    )
}
