import AdminDashboardLayout from '~/admin/layout/admin-dashboard'
import AdminMythsPage from '~/admin/features/myths/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import Myth from '#models/myth'

interface AdminMythsProps {
    cultureId: string,
    myths: TableData<Myth[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc',
}

export default function AdminMyths(props: AdminMythsProps) {
    console.log("AdminMyths page props:", props)
    const { myths, sortBy, sortOrder, cultureId } = props
    return <AdminMythsPage myths={myths} sortBy={sortBy} sortOrder={sortOrder} cultureId={cultureId} />
}

AdminMyths.layout = (page: ReactNode) => {
    return <AdminDashboardLayout title="Myths">{page}</AdminDashboardLayout>
}
