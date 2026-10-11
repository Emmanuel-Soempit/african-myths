import Button from '~/shared/ui/button'

export default function MythEditHeader() {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-light)]/80 dark:bg-[var(--color-admin-background-dark)]/80 px-10 py-3 backdrop-blur-sm">
            <div className="flex flex-col">
                <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Edit Myth
                </h1>
                <p className="text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    Modify the details of an existing myth.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button className="rounded-lg border border-[var(--color-admin-border-light)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--color-admin-text-primary-light)] transition-colors hover:bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:hover:bg-[var(--color-admin-surface-dark)]">
                    Cancel
                </button>
                <Button
                    variant="admin-primary"
                    className="h-auto px-4 py-2 text-sm font-semibold"
                >
                    Save Changes
                </Button>
            </div>
        </header>
    )
}
