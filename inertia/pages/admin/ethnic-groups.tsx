import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminEthnicGroupsPage from '~/admin/features/ethnic-groups/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import EthnicGroup from '#models/ethnic_group'

interface AdminEthnicGroupsProps {
    ethnicGroups: TableData<EthnicGroup[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function AdminEthnicGroups({ ethnicGroups, sortBy, sortOrder }: AdminEthnicGroupsProps) {
    return <AdminEthnicGroupsPage ethnicGroups={ ethnicGroups}  sortBy={sortBy} sortOrder={sortOrder}/>
}

AdminEthnicGroups.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Ethnic Groups">
            {page}
        </AdminDashboardLayout>
    )
}
