import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import AdminEthnicGroupsPage from '~/admin/features/ethnic-groups/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import EthnicGroup from '#models/ethnic_group'

interface EditorEthnicGroupsProps {
    ethnicGroups: TableData<EthnicGroup[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function EditorEthnicGroups({ ethnicGroups, sortBy, sortOrder }: EditorEthnicGroupsProps) {
    return <AdminEthnicGroupsPage ethnicGroups={ethnicGroups} sortBy={sortBy} sortOrder={sortOrder} />
}

EditorEthnicGroups.layout = (page: ReactNode) => {
    return (
        <EditorDashboardLayout title="Ethnic Groups">
            {page}
        </EditorDashboardLayout>
    )
}
