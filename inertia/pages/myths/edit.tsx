import { ReactNode } from 'react'
import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import MythEditView from '~/shared/features/myths/myth_edit_view'

export default function MythEditPage() {
    return (
        <MythEditView />
    )
}

MythEditPage.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Edit Myth" hideHeader>
            {page}
        </AdminDashboardLayout>
    )
}