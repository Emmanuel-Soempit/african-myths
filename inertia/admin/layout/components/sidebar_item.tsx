import { Link } from '@inertiajs/react'
import { SidebarItem as SidebarItemType } from '../types'

interface SidebarItemProps {
    item: SidebarItemType
    isActive?: boolean
}

export default function SidebarItem({ item, isActive }: SidebarItemProps) {
    return (
        <Link
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                    ? 'bg-[#E88D39]/20 text-[var(--color-admin-primary)]'
                    : 'text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
            href={item.href}
        >
            <span className="material-symbols-outlined">{item.icon}</span>
            <p className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
            </p>
        </Link>
    )
}
