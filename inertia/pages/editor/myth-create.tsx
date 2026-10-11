import { ReactNode } from 'react'
import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import MythCreateView from '~/shared/features/myths/myth_create_view'

interface MythCreatePageProps {
    subEthnicGroups: Array<{ value: string; label: string }>
    cultureId: string
    myth?: any
}

export default function EditorMythCreatePage({ subEthnicGroups, cultureId, myth }: MythCreatePageProps) {
    return <MythCreateView subEthnicGroups={subEthnicGroups} cultureId={cultureId} myth={myth} />
}

EditorMythCreatePage.layout = (page: ReactNode) => {
    return (
        <EditorDashboardLayout title="Create Myth" hideHeader>
            {page}
        </EditorDashboardLayout>
    )
}
