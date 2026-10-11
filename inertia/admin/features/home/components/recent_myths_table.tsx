import { Link } from "@inertiajs/react"

export default function RecentMythsTable({ recentMyths }: { recentMyths?: any[] }) {
    const dummyMyths = [
        {
            title: 'The Legend of Anansi',
            culture: 'Akan',
            status: 'Published',
            statusColor: 'green',
        },
        {
            title: "Oshun's Golden River",
            culture: 'Yoruba',
            status: 'Pending',
            statusColor: 'yellow',
        },
        {
            title: 'The Creation of the World',
            culture: 'Egyptian',
            status: 'Published',
            statusColor: 'green',
        },
        {
            title: "Shaka Zulu's Rise",
            culture: 'Zulu',
            status: 'Published',
            statusColor: 'green',
        },
    ]

    const getStatusClass = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'published') return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        if (s === 'pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        if (s === 'rejected') return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        return 'bg-stone-100 text-stone-800 dark:bg-stone-900/50 dark:text-stone-300'; // draft/other
    }

    const hasMyths = recentMyths && recentMyths.length > 0;
    const displayMyths = hasMyths
        ? recentMyths.map((m: any) => ({
              id: m.id,
              title: m.name || m.title || 'Untitled Myth',
              culture: m.culture?.name || 'Unknown',
              status: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : 'Draft',
              statusColorClass: getStatusClass(m.status),
              cultureId: m.cultureId
          }))
        : dummyMyths.map(dm => ({
              ...dm,
              id: '',
              statusColorClass: dm.statusColor === 'green'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
              cultureId: ''
          }));

    return (
        <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)] lg:col-span-2">
            <h2 className="font-display border-b border-[var(--color-admin-border-light)] px-6 py-4 text-xl font-bold text-[var(--color-admin-text-primary-light)] dark:border-[var(--color-admin-border-dark)] dark:text-[var(--color-admin-text-primary-dark)]">
                Recently Added Myths
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        <tr className="border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]">
                            <th className="px-6 py-3 font-medium" scope="col">
                                Title
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                                Culture
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                                Status
                            </th>
                            <th
                                className="px-6 py-3 font-medium text-right"
                                scope="col"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {displayMyths.map((myth, index) => (
                            <tr
                                key={myth.title + index}
                                className={
                                    index < displayMyths.length - 1
                                        ? 'border-b border-[var(--color-admin-border-light)] dark:border-[var(--color-admin-border-dark)]'
                                        : ''
                                }
                            >
                                <td className="px-6 py-4 font-medium">
                                    {myth.title}
                                </td>
                                <td className="px-6 py-4 text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    {myth.culture}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${myth.statusColorClass}`}
                                    >
                                        {myth.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2 items-center">
                                        {myth.cultureId && myth.id ? (
                                            <Link href={`/admin/cultures/${myth.cultureId}/myths/${myth.id}/edit`} className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:text-[var(--color-admin-primary)]">
                                                <span className="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                            </Link>
                                        ) : (
                                            <button className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:text-[var(--color-admin-primary)]">
                                                <span className="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                            </button>
                                        )}
                                        <button className="h-8 w-8 flex items-center justify-center text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)] hover:text-red-500">
                                            <span className="material-symbols-outlined text-xl">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
