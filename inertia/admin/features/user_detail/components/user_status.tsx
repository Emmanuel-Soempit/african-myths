export default function UserStatus() {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <h2 className="font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Account Status
                </h2>
                <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    User's account activity status.
                </p>
            </div>
            <div className="md:col-span-2">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Status
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
