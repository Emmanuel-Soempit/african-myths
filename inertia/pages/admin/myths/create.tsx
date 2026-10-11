import { ReactNode } from 'react'
import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import MythCreateView from '~/shared/features/myths/myth_create_view';

interface MythCreatePageProps {
    subEthnicGroups: Array<{ value: string; label: string }>
    cultureId: string
    myth?: any
}

export default function MythCreatePage({ subEthnicGroups, cultureId, myth }: MythCreatePageProps) {
    return <MythCreateView subEthnicGroups={subEthnicGroups} cultureId={cultureId} myth={myth} />
}

MythCreatePage.layout = (page: ReactNode) => {
    return (
        <AdminDashboardLayout title="Create Myth" hideHeader>
            {page}
        </AdminDashboardLayout>
    )
}
