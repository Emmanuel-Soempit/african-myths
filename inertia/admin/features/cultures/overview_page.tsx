import { router } from '@inertiajs/react'
import { useState } from 'react'
import Button from '~/shared/ui/button'
import Culture from '#models/culture'
import toast from 'react-hot-toast'
import useDashboardContext from '~/shared/hooks/use_dashboard_context'

interface StatCard {
    title: string
    description: string
    icon: string
    count: number
    linkText: string
    link?: string
}

const buildStatCards = (basePath: string, canPublish: boolean): StatCard[] => [
    {
        title: 'Myths',
        description: 'Associated myths',
        icon: 'auto_stories',
        count: 0,
        linkText: 'View all myths',
        link: `${basePath}/cultures/:cultureId/myths`,
    },
    ...(canPublish
        ? [{
            title: 'Writings',
            description: 'Poems, stories & articles',
            icon: 'history_edu',
            count: 0,
            linkText: 'View all writings',
            link: '/admin/writings',
        }]
        : []),
    // {
    //     title: 'Books',
    //     description: 'Related books',
    //     icon: 'menu_book',
    //     count: 0,
    //     linkText: 'View all books',
    // },
    // {
    //     title: 'Proverbs',
    //     description: 'Collection of proverbs',
    //     icon: 'format_quote',
    //     count: 0,
    //     linkText: 'View all proverbs',
    // },
    // {
    //     title: 'Subcultures',
    //     description: 'Related subcultures',
    //     icon: 'diversity_3',
    //     count: 0,
    //     linkText: 'View all subcultures',
    // },
]

interface AdminCultureOverviewPageProps {
    culture: Culture
}

export default function AdminCultureOverviewPage({ culture }: AdminCultureOverviewPageProps) {
    const { basePath, apiBase, can } = useDashboardContext()
    const [status, setStatus] = useState(culture.status || 'draft')
    const [isUpdating, setIsUpdating] = useState(false)
    const statCards = buildStatCards(basePath, can.publish)
    const statusLocked = !can.publish && ['published', 'rejected'].includes(culture.status)

    const handleStatusChange = (newStatus: string) => {
        setIsUpdating(true)
        // @ts-ignore
        setStatus(newStatus)

        router.put(`${apiBase}/cultures/${culture.id}`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Culture status updated')
            },
            onError: () => {
                toast.error('Failed to update status')
                setStatus(culture.status || 'draft')
            },
            onFinish: () => {
                setIsUpdating(false)
            }
        })
    }

    const cultureName = (culture as any).name ?? 'Culture'
    const ethnicGroupName = (culture as any).ethnicGroup?.canonicalName ?? ''

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        <a className="hover:text-[var(--color-admin-primary)]" href={`${basePath}/cultures`}>
                            Cultures
                        </a>
                        <span>/</span>
                        <span className="text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {cultureName}
                        </span>
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        {cultureName} Overview
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        {ethnicGroupName
                            ? `${ethnicGroupName} ethnic group · `
                            : ''}
                        An overview of content related to the {cultureName} culture.
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    {/* Status Dropdown Selector */}
                    {statusLocked && (
                        <span className="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset bg-green-50 text-green-700 ring-green-200 dark:bg-green-950/30 dark:text-green-300">
                            {culture.status.charAt(0).toUpperCase() + culture.status.slice(1)}
                        </span>
                    )}
                    <div className="relative flex items-center">
                        <select
                            disabled={isUpdating || statusLocked}
                            value={statusLocked ? 'draft' : status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`h-10 rounded-lg px-3 pr-8 text-sm font-semibold border bg-transparent cursor-pointer appearance-none transition-all outline-none focus:ring-1 focus:ring-[var(--color-admin-primary)] ${status === 'published' ? 'border-green-300 text-green-700 bg-green-50/50 dark:border-green-900/50 dark:text-green-300 dark:bg-green-950/20' :
                                    status === 'pending' ? 'border-yellow-300 text-yellow-700 bg-yellow-50/50 dark:border-yellow-900/50 dark:text-yellow-300 dark:bg-yellow-950/20' :
                                        status === 'rejected' ? 'border-red-300 text-red-700 bg-red-50/50 dark:border-red-900/50 dark:text-red-300 dark:bg-red-950/20' :
                                            'border-gray-300 text-gray-700 bg-gray-50/50 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800/20'
                                }`}
                        >
                            <option value="draft" className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">Draft</option>
                            <option value="pending" className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">{can.publish ? 'Pending Review' : 'Submit for review'}</option>
                            {can.publish && (
                                <>
                                    <option value="published" className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">Published</option>
                                    <option value="rejected" className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white">Rejected</option>
                                </>
                            )}
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 pointer-events-none text-base text-gray-500 dark:text-gray-400">
                            arrow_drop_down
                        </span>
                    </div>

                    <Button
                        onClick={() => {
                            router.visit(`${basePath}/cultures/${culture.id}/edit`)
                        }}
                        variant="admin-primary"
                        className="h-10 min-w-[84px] max-w-[480px] px-4"
                    >
                        <span className="material-symbols-outlined text-base">
                            edit
                        </span>
                        <span className="truncate text-sm font-bold">
                            Update Culture Details
                        </span>
                    </Button>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                                    {card.title}
                                </h3>
                                <p className="mt-1 text-sm text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    {card.description}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-3xl text-[var(--color-admin-primary)]">
                                {card.icon}
                            </span>
                        </div>
                        <p className="mt-6 text-4xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                            {card.count}
                        </p>
                        <a
                            className="mt-1 text-sm font-medium text-[var(--color-admin-primary)] hover:underline"
                            href={card.link ? (card.link.includes(':cultureId') ? card.link.replace(':cultureId', culture.id) : `${card.link}?cultureId=${culture.id}`) : '#'}
                        >
                            {card.linkText}
                        </a>
                    </div>
                ))}
            </div>
        </>
    )
}
