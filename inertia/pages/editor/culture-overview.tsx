import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import AdminCultureOverviewPage from '~/admin/features/cultures/overview_page'
import { ReactNode } from 'react'
import Culture from '#models/culture'

interface EditorCultureOverviewProps {
    culture: Culture
}

export default function EditorCultureOverview({ culture }: EditorCultureOverviewProps) {
    return <AdminCultureOverviewPage culture={culture} />
}

EditorCultureOverview.layout = (page: ReactNode) => {
    return (
        <EditorDashboardLayout title="Culture Overview">
            {page}
        </EditorDashboardLayout>
    )
}
