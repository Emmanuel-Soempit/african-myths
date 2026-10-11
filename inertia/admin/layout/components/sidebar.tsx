import { Link, usePage } from '@inertiajs/react'
import SidebarItem from './sidebar_item'
import { SIDEBAR_ITEMS } from '../utils/sidebar_items'

export default function Sidebar() {
    const { url } = usePage()

    return (
        <aside className="flex w-64 flex-col border-r border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-light)] dark:bg-[var(--color-admin-surface-dark)] p-4">
            <div className="flex items-center gap-3 px-3 py-2">
                <div className="size-8 text-[var(--color-admin-primary)]">
                    <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#clip0_6_319)">
                            <path
                                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                                fill="currentColor"
                            ></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_6_319">
                                <rect fill="white" height="48" width="48"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <h1 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                    Kólà
                </h1>
            </div>
            <div className="flex h-full flex-col justify-between pt-8">
                <div className="flex flex-col gap-2">
                    {SIDEBAR_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            isActive={url.includes(item.href)}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                    <Link
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:bg-gray-100 dark:hover:bg-white/10"
                        href="/api/v1/sign-out"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium">Logout</p>
                    </Link>
                </div>
            </div>
        </aside>
    )
}
