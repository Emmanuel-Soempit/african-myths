import Stats from './components/stats'
import RecentMythsTable from './components/recent_myths_table'
import NewUsersList from './components/new_users_list'
import Button from '~/shared/ui/button'

export default function AdminHomePage({ stats, newUsers, recentMyths }: { stats?: any, newUsers?: any[], recentMyths?: any[] }) {
    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Kólà Dashboard
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Welcome back! Here's an overview of your platform's activity.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] px-4 text-sm font-bold text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                        <span className="material-symbols-outlined text-base">
                            public
                        </span>
                        <span className="truncate">Create Culture</span>
                    </button>
                    <Button variant="admin-primary" className="h-10 min-w-[84px] max-w-[480px] gap-2 px-4 text-sm">
                        <span className="material-symbols-outlined text-base">
                            add_circle
                        </span>
                        <span className="truncate">
                            Add New Myth
                        </span>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <Stats stats={stats} />

            {/* Data Tables and Charts */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <RecentMythsTable recentMyths={recentMyths} />
                <NewUsersList users={newUsers} />
            </div>
        </>
    )
}
