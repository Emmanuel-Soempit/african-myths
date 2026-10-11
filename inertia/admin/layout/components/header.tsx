import User from "#models/user"
import { usePage } from "@inertiajs/react"

export default function Header() {
    const { props } = usePage()
    const user = props.user as User
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-light)]/80 dark:bg-[var(--color-admin-background-dark)]/80 px-10 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-8">
                <label className="flex flex-col h-10 w-80 max-w-sm">
                    <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                        <div className="text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] flex items-center justify-center rounded-l-lg border border-r-0 border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-light)] dark:bg-[var(--color-admin-surface-dark)] pl-4">
                            <span className="material-symbols-outlined text-base">
                                search
                            </span>
                        </div>
                        <input
                            className="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-l-0 border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-4 text-sm font-normal leading-normal text-[var(--color-admin-text-primary-light)] placeholder:text-[var(--color-admin-text-secondary-light)] focus:outline-0 focus:ring-0 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)] dark:placeholder:text-[var(--color-admin-text-secondary-dark)]"
                            placeholder="Search for myths, users, etc."
                        />
                    </div>
                </label>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[var(--color-admin-surface-light)] text-[var(--color-admin-text-secondary-light)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                    <span className="material-symbols-outlined text-xl">
                        notifications
                    </span>
                </button>
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[var(--color-admin-surface-light)] text-[var(--color-admin-text-secondary-light)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-secondary-dark)] border border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                    <span className="material-symbols-outlined text-xl">help</span>
                </button>
                <div className="flex items-center gap-3">
                    <div
                        className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                        data-alt="Admin user avatar"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBp-Iq-HaRIpDFB6krfRyDwtExKrSuUGyRu8-I7nxmN_LWaCScs-O9Gu8X7cS8OfZqcpnvXi8pM-AuL2O4dRodc2LaEtW_f9iB-K202fDcP1n03jJKVEtKhJEKX8J8fzkBWcqRVff1PFT4PojUSVCPFTVb8JtinG2-_IKF50_xsM_86H42zo3i5_HCinhXBQWlRPyOq2sL0XSFei0pcJSpujfk8ya1c75eGQbwlMQxxnMJtaxvcWJvHyYeKtZQ7YfyUfDuKIW3inLc')",
                        }}
                    ></div>
                    <div className="flex flex-col text-left">
                        <h1 className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                        </h1>
                        <p className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}