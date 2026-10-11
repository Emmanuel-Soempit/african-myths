import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import EditorDashboardPage from '~/editor/features/dashboard/page'
import { ReactNode } from 'react'

export default function EditorDashboard(props: any) {
    return <EditorDashboardPage {...props} />
}

EditorDashboard.layout = (page: ReactNode) => {
    return <EditorDashboardLayout title="Dashboard">{page}</EditorDashboardLayout>
}
