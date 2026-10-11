import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminSettingsPage from '~/admin/features/settings/page'
import { ReactNode } from 'react'

export default function AdminSettings() {
    return <AdminSettingsPage />
}

AdminSettings.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Settings">{page}</AdminDashboardLayout>
}
