export default function UserProfileHeader() {
    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
                <div
                    className="aspect-square size-32 rounded-full bg-cover bg-center bg-no-repeat"
                    data-alt="User avatar"
                    style={{
                        backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdrZL6vsyyX6xlmdP7dF9zlNNaWL774IOXMvTgpkvUrKNceBolUktZ9cVkUGhpKWwy8NmdNKxrJ2l2MSOGKdO7V1j5V46EYepXeoH4jp6-9ICS7H8oWR9Vt0c711yIk0pNxxSeGSZrc0fJ_VRmokcUO3wVoffZhPTysZviQiVeNgpIrj9fLRdlhbHV14rVXVIiOGzpelrSujAUlItCLJrrjN52EPjtTLZu_bjJ7Km7_RTM_Uztgix-him3YaBRx9PoBXO4zbS2-gM')",
                    }}
                ></div>
                <button className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-admin-surface-light)] bg-[var(--color-admin-primary)] text-white dark:border-[var(--color-admin-surface-dark)]">
                    <span className="material-symbols-outlined text-xl">edit</span>
                </button>
            </div>
            <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
                <div className="text-center sm:text-left">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Adebayo Okoro
                    </h1>
                    <p className="mt-1 text-base text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Joined on October 26, 2023
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-4 text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                        <span className="material-symbols-outlined text-base">
                            edit
                        </span>
                        <span className="truncate">Edit Profile</span>
                    </button>
                    <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-red-500/50 bg-transparent px-4 text-sm font-medium text-red-500 hover:bg-red-500/10">
                        <span className="material-symbols-outlined text-base">
                            delete
                        </span>
                        <span className="truncate">Delete User</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
