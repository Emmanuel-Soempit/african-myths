export default function UserRoles() {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <h2 className="font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Roles & Permissions
                </h2>
                <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    User's assigned roles on the platform.
                </p>
            </div>
            <div className="space-y-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Current Roles
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--color-admin-primary)]/20 px-3 py-1 text-sm font-medium text-[var(--color-admin-primary)]">
                            Administrator
                        </span>
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            Contributor
                        </span>
                    </div>
                </div>
                <button className="flex h-9 min-w-[36px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 text-sm font-medium text-[var(--color-admin-text-secondary-light)] hover:bg-gray-50 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-base">
                        manage_accounts
                    </span>
                    <span className="truncate">Manage Roles</span>
                </button>
            </div>
        </div>
    )
}
