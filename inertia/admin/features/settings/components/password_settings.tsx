import Input from '~/shared/ui/input'
import Button from '~/shared/ui/button'

export default function PasswordSettings() {
    return (
        <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-light)] dark:bg-[var(--color-admin-surface-dark)]">
            <div className="border-b border-[var(--color-admin-border-light)] p-6 dark:border-[var(--color-admin-border-dark)]">
                <h2 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Change Password
                </h2>
                <p className="mt-1 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    For your security, we recommend using a strong password that
                    you're not using elsewhere.
                </p>
            </div>
            <div className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                            htmlFor="currentPassword"
                        >
                            Current Password
                        </label>
                        <Input
                            id="currentPassword"
                            type="password"
                            variant="admin-primary"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                            htmlFor="newPassword"
                        >
                            New Password
                        </label>
                        <Input
                            id="newPassword"
                            type="password"
                            variant="admin-primary"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                            htmlFor="confirmPassword"
                        >
                            Confirm New Password
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            variant="admin-primary"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end border-t border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)]/50 px-6 py-4 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)]/50 rounded-b-xl">
                <Button variant="admin-primary">Update Password</Button>
            </div>
        </div>
    )
}
