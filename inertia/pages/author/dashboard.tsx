import AuthorDashboardLayout from '~/author/layout/author-dashboard'
import AuthorDashboardPage from '~/author/features/dashboard/page'
import { ReactNode } from 'react'

export default function AuthorDashboard(props: any) {
    return <AuthorDashboardPage {...props} />
}

AuthorDashboard.layout = (page: ReactNode) => {
    return <AuthorDashboardLayout title="Dashboard">{page}</AuthorDashboardLayout>
}
