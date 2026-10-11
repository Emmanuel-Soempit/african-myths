

interface RoleCardProps {
    icon: string
    title: string
    description: string
    selected?: boolean
    onClick?: () => void
}

export default function RoleCard({
    icon,
    title,
    description,
    selected,
    onClick,
}: RoleCardProps) {
    console.log('Icon: ', icon)
    return (
        <div
            onClick={onClick}
            className={`group flex flex-1 cursor-pointer flex-col gap-4 rounded-lg border-2 bg-[var(--color-roles-card-light)] p-6 text-center transition-all hover:border-[var(--color-roles-primary)]/50 focus-within:border-[var(--color-roles-primary)] dark:bg-[var(--color-roles-card-dark)] dark:hover:border-[var(--color-roles-primary)]/50 dark:focus-within:border-[var(--color-roles-primary)] ${selected
                ? 'border-[var(--color-roles-primary)]'
                : 'border-transparent'
                }`}
        >
            <div className="flex justify-center text-[var(--color-roles-primary)]">
                <span className="material-symbols-outlined !text-4xl">{icon}</span>
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl font-medium leading-tight text-[var(--color-roles-text-light)] dark:text-[var(--color-roles-text-dark)]">
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                </h2>
                <p className="text-sm font-normal leading-normal text-[var(--color-roles-muted-light)] dark:text-[var(--color-roles-muted-dark)]">
                    {description}
                </p>
            </div>
        </div>
    )
}
