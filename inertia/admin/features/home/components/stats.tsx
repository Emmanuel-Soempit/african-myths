export default function Stats({ stats }: { stats?: any }) {
    const displayStats = [
        { label: 'Total Cultures', value: stats?.totalCultures?.toLocaleString() ?? '78', link: '/admin/cultures' },
        { label: 'Total Ethnic Groups', value: stats?.totalEthnicGroups?.toLocaleString() ?? '24', link: '/admin/ethnic-groups' },
        { label: 'Registered Users', value: stats?.totalUsers?.toLocaleString() ?? '8,621', link: '/admin/users' },
        { label: 'Pending Approvals', value: stats?.pendingApprovals?.toLocaleString() ?? '12', link: '#' },
    ]

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayStats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex flex-col gap-2 rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]"
                >
                    <p className="text-base font-medium text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        {stat.label}
                    </p>
                    <p className="font-display text-3xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {stat.value}
                    </p>
                    <a
                        className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline"
                        href={stat.link}
                    >
                        View All
                    </a>
                </div>
            ))}
        </div>
    )
}