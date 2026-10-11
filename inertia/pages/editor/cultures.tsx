import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import AdminCulturesPage from '~/admin/features/cultures/page'
import { ReactNode } from 'react'
import { TableData } from '~/types'
import Culture from '#models/culture'

interface EditorCulturesProps {
    cultures: TableData<Culture[]>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export default function EditorCultures({ cultures, sortBy, sortOrder }: EditorCulturesProps) {
    return <AdminCulturesPage cultures={cultures} sortBy={sortBy} sortOrder={sortOrder} />
}

EditorCultures.layout = (page: ReactNode) => {
    return <EditorDashboardLayout title="Cultures">{page}</EditorDashboardLayout>
}
