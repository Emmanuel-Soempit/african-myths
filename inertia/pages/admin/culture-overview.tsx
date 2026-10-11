import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminCultureOverviewPage from '~/admin/features/cultures/overview_page'
import { ReactNode } from 'react'
import Culture from '#models/culture'

interface AdminCultureOverviewProps {
    culture: Culture
}

export default function AdminCultureOverview({ culture }: AdminCultureOverviewProps) {
    return <AdminCultureOverviewPage culture={culture} />
}

AdminCultureOverview.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Culture Overview">
            {page}
        </AdminDashboardLayout>
    )
}
