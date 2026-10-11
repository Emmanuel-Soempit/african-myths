import { ReactNode } from 'react'
import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import UserDetailView from '~/admin/features/user_detail/page'

export default function UserDetailPage() {
    return <UserDetailView />
}

UserDetailPage.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="User Details" hideHeader>
            {page}
        </AdminDashboardLayout>
    )
}
