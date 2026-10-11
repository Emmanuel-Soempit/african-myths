import { ReactNode } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { EDITOR_SIDEBAR_ITEMS } from "./utils/sidebar_items";

interface EditorDashboardLayoutProps {
    children: ReactNode;
    title?: string;
    hideHeader?: boolean;
}

export default function EditorDashboardLayout({ children, title, hideHeader = false }: EditorDashboardLayoutProps) {
    const { url, props } = usePage()
    const user = (props as any).user
    const firstName = user?.profile?.firstName ?? ''
    const lastName = user?.profile?.lastName ?? ''
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'E'
    const roleLabel = user?.metadata?.role?.name === 'admin' ? 'Administrator' : 'Editor'

    return (
        <>
            <Head title={title} />
            <div className="relative flex h-auto min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
                <div className="flex h-full min-h-screen">
                    {/* SIDEBAR */}
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
                            <div className="flex flex-col">
                                <h1 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                    Kólà
                                </h1>
                                <p className="text-xs font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    Editor
                                </p>
                            </div>
                        </div>
                        <div className="flex h-full flex-col justify-between pt-8">
                            <nav className="flex flex-col gap-2">
                                {EDITOR_SIDEBAR_ITEMS.map((item) => {
                                    const isActive = url.startsWith(item.href)
                                    return (
                                        <Link
                                            key={item.label}
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
                                })}
                            </nav>
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

                    {/* MAIN CONTENT WRAPPER */}
                    <main className="flex-1 overflow-y-auto">
                        {!hideHeader && (
                            <header className="sticky top-0 z-10 flex items-center justify-end whitespace-nowrap border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-light)]/80 dark:bg-[var(--color-admin-background-dark)]/80 px-10 py-3 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-admin-primary)]/20 text-sm font-bold text-[var(--color-admin-primary)]">
                                        {initials}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <h1 className="text-sm font-medium text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                            {firstName} {lastName}
                                        </h1>
                                        <p className="text-xs text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                            {roleLabel}
                                        </p>
                                    </div>
                                </div>
                            </header>
                        )}
                        <div className={!hideHeader ? "p-10" : ""}>{children}</div>
                    </main>
                </div>

                {/* Floating Action Button */}
                <Link
                    href="/editor/cultures"
                    className="fixed bottom-10 right-10 w-14 h-14 bg-[var(--color-admin-primary)] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                    <span className="absolute right-full mr-4 bg-[var(--color-admin-surface-dark)] border border-[var(--color-admin-border-dark)] px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[var(--color-admin-text-primary-dark)]">
                        Add or edit cultures
                    </span>
                </Link>
            </div>
        </>
    );
}
