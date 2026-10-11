import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import AdminEthnicGroupDetailPage from '~/admin/features/ethnic-groups/detail_page'
import { ReactNode } from 'react'
import EthnicGroup from '#models/ethnic_group'
import SubEthnicGroup from '#models/sub_ethnic_group'
import { TableData } from '~/types'

export default function EditorEthnicGroupDetail({ ethnicGroup, subEthnicGroups }: { ethnicGroup: EthnicGroup, subEthnicGroups: TableData<SubEthnicGroup[]> }) {
    return <AdminEthnicGroupDetailPage ethnicGroup={ethnicGroup} subEthnicGroups={subEthnicGroups} />
}

EditorEthnicGroupDetail.layout = (page: ReactNode) => {
    return (
        <EditorDashboardLayout title="Ethnic Group Details">
            {page}
        </EditorDashboardLayout>
    )
}
