import { ReactNode } from 'react'
import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import StoryEditView from '~/shared/features/stories/story_edit_view'

export default function StoryEditPage() {
    return (
        <StoryEditView />
    )
}

StoryEditPage.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Edit Story" hideHeader>
            {page}
        </AdminDashboardLayout>
    )
}
