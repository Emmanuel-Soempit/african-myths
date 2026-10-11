import { ReactNode } from 'react'

interface CollapsibleSectionProps {
    title: string
    id?: string
    children: ReactNode
    defaultOpen?: boolean
    onEdit?: () => void
}

export default function CollapsibleSection({
    title,
    id,
    children,
    defaultOpen = false,
    onEdit,
}: CollapsibleSectionProps) {
    return (
        <section className="mb-12 scroll-mt-24" id={id}>
            <details className="group" open={defaultOpen}>
                <summary className="flex cursor-pointer list-none items-center justify-between border-b border-[var(--color-admin-border-light)] pb-4 mb-6 dark:border-[var(--color-admin-border-dark)]">
                    <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.015em] text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {title}
                    </h2>
                    <div className="flex items-center gap-4">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    onEdit()
                                }}
                                className="text-[var(--color-admin-text-secondary-light)] hover:text-[var(--color-admin-primary)] dark:text-[var(--color-admin-text-secondary-dark)]"
                            >
                                <span className="material-symbols-outlined !text-2xl">
                                    edit
                                </span>
                            </button>
                        )}
                        <span className="material-symbols-outlined !text-3xl text-[var(--color-admin-text-secondary-light)] transition-transform group-open:rotate-180 dark:text-[var(--color-admin-text-secondary-dark)]">
                            expand_more
                        </span>
                    </div>
                </summary>
                <div className="prose prose-lg max-w-none font-sans text-[var(--color-admin-text-primary-light)] dark:prose-invert dark:text-[var(--color-admin-text-primary-dark)]">
                    {children}
                </div>
            </details>
        </section>
    )
}
