export default function UserPersonalInfo() {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <h2 className="font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Personal Information
                </h2>
                <p className="text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    Basic details about the user.
                </p>
            </div>
            <div className="space-y-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Full Name
                    </label>
                    <p className="mt-1 text-base text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Adebayo Okoro
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Email Address
                    </label>
                    <p className="mt-1 text-base text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        adebayo.o@example.com
                    </p>
                </div>
            </div>
        </div>
    )
}
