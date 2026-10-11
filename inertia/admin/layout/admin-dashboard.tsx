import { ReactNode } from 'react'
import Sidebar from './components/sidebar'
import Header from './components/header'
import { Head } from '@inertiajs/react'

interface AdminDashboardLayoutProps {
    children: ReactNode
    title?: string
    hideHeader?: boolean
}

export default function AdminDashboardLayout({
    title,
    children,
    hideHeader = false,
}: AdminDashboardLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="relative flex h-auto min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
                <div className="flex h-full min-h-screen">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto">
                        {!hideHeader && <Header />}
                        <div className={!hideHeader ? "p-10" : ""}>{children}</div>
                    </main>
                </div>
            </div>
        </>
    )
}
