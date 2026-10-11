import Button from '~/shared/ui/button'

export default function CultureEditHeader() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[var(--color-admin-border-light)] bg-[var(--color-admin-background-light)]/80 px-4 py-3 backdrop-blur-sm dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-background-dark)]/80 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="size-6 text-[var(--color-admin-primary)]">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_6_319)">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_6_319">
                                    <rect
                                        fill="white"
                                        height="48"
                                        width="48"
                                    ></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.015em] text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Kólà{' '}
                        <span className="ml-2 font-sans text-sm font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                            Admin
                        </span>
                    </h2>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
                <Button
                    variant="admin-primary"
                    className="max-w-fit gap-2 text-sm"
                >
                    <span className="material-symbols-outlined !text-xl">
                        save
                    </span>
                    <span className="truncate">Save Changes</span>
                </Button>
                <div
                    className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat"
                    data-alt="User profile avatar"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC77a1T9mrno9VGtuEcIN1PVi-8JpM60cs653MdbSzdU8ubne1vScANWdNL0K61ZbuU4IymD0tCyvd_ufS4hXgLaZ-iZneJ6c4IqmBvNlObkYs9JolelM8XODCu2pZh-KQ_UJFjj2TRC-7hRBG7LB4A6xLj4ayWYmVUkrH4jES_w0LnS-1obUjNaZajTMbG-jQzzIJ82GHfoGg79rpQsFP_qM3HBwxWfwfvP9AFp4DtaohzgBBND1EWMvkDUAL8Ij638MSmaS3eSj8")',
                    }}
                ></div>
            </div>
        </header>
    )
}
