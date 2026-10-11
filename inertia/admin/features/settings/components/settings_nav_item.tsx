interface SettingsNavItemProps {
    icon: string
    label: string
    active?: boolean
    onClick?: () => void
}

export default function SettingsNavItem({
    icon,
    label,
    active = false,
    onClick,
}: SettingsNavItemProps) {
    return (
        <a
            className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer ${active
                    ? 'bg-[#E88D39]/20 text-[var(--color-admin-primary)]'
                    : 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
            onClick={onClick}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
            </span>
        </a>
    )
}
