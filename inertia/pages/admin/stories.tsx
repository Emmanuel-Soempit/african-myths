import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminStoriesPage from '~/admin/features/stories/page'
import { ReactNode } from 'react'

export default function AdminStories() {
    return <AdminStoriesPage />
}

AdminStories.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Stories">{page}</AdminDashboardLayout>
}
