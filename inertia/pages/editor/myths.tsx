import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import AdminMythsPage from '~/admin/features/myths/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import Myth from '#models/myth'

interface EditorMythsProps {
    cultureId: string
    myths: TableData<Myth[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function EditorMyths({ myths, sortBy, sortOrder, cultureId }: EditorMythsProps) {
    return <AdminMythsPage myths={myths} sortBy={sortBy} sortOrder={sortOrder} cultureId={cultureId} />
}

EditorMyths.layout = (page: ReactNode) => {
    return <EditorDashboardLayout title="Myths">{page}</EditorDashboardLayout>
}
