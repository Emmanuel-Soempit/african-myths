import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminHomePage from '~/admin/features/home/page'
import { ReactNode } from 'react'

export default function AdminDashboard(props: any) {
    return <AdminHomePage {...props} />
}


AdminDashboard.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title='' >
        {page}
    </AdminDashboardLayout>
}