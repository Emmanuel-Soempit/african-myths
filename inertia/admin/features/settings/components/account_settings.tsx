import Input from '~/shared/ui/input'
import Button from '~/shared/ui/button'

export default function AccountSettings() {
    return (
        <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-light)] dark:bg-[var(--color-admin-surface-dark)]">
            <div className="border-b border-[var(--color-admin-border-light)] p-6 dark:border-[var(--color-admin-border-dark)]">
                <h2 className="font-display text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Account Information
                </h2>
                <p className="mt-1 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                    Update your account's profile information and email address.
                </p>
            </div>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-6">
                    <div
                        className="aspect-square size-20 rounded-full bg-cover bg-center bg-no-repeat"
                        data-alt="Admin user avatar"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBp-Iq-HaRIpDFB6krfRyDwtExKrSuUGyRu8-I7nxmN_LWaCScs-O9Gu8X7cS8OfZqcpnvXi8pM-AuL2O4dRodc2LaEtW_f9iB-K202fDcP1n03jJKVEtKhJEKX8J8fzkBWcqRVff1PFT4PojUSVCPFTVb8JtinG2-_IKF50_xsM_86H42zo3i5_HCinhXBQWlRPyOq2sL0XSFei0pcJSpujfk8ya1c75eGQbwlMQxxnMJtaxvcWJvHyYeKtZQ7YfyUfDuKIW3inLc')",
                        }}
                    ></div>
                    <div className="flex gap-2">
                        <button className="flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-3 text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                            Change
                        </button>
                        <button className="flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-3 text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:bg-gray-100 dark:hover:bg-white/10">
                            Remove
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                            htmlFor="fullName"
                        >
                            Full Name
                        </label>
                        <Input
                            id="fullName"
                            type="text"
                            defaultValue="Admin Name"
                            variant="admin-primary"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue="admin@kola.com"
                            variant="admin-primary"
                        />
                    </div>
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]"
                        htmlFor="bio"
                    >
                        Bio
                    </label>
                    <textarea
                        className="form-textarea mt-1 block w-full rounded-lg border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)] px-3 py-2 text-sm text-[var(--color-admin-text-primary-light)] focus:border-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)] dark:text-[var(--color-admin-text-primary-dark)]"
                        id="bio"
                        placeholder="Tell us a bit about yourself."
                        rows={3}
                        defaultValue="Administrator for the Kólà platform. Passionate about preserving and sharing African stories."
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)]/50 px-6 py-4 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)]/50 rounded-b-xl">
                <button className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-4 text-sm font-bold text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Cancel
                </button>
                <Button variant="admin-primary">Save Changes</Button>
            </div>
        </div>
    )
}
