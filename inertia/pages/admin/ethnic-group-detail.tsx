import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminEthnicGroupDetailPage from '~/admin/features/ethnic-groups/detail_page'
import { ReactNode } from 'react'
import EthnicGroup from '#models/ethnic_group'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { TableData } from '~/types'

export default function AdminEthnicGroupDetail({ ethnicGroup, subEthnicGroups }: { ethnicGroup: EthnicGroup, subEthnicGroups: TableData<SubEthnicGroup[]> }) {
    return <AdminEthnicGroupDetailPage ethnicGroup={ethnicGroup} subEthnicGroups={subEthnicGroups} />
}

AdminEthnicGroupDetail.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Ethnic Group Details">
            {page}
        </AdminDashboardLayout>
    )
}
