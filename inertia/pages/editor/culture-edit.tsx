import EditorDashboardLayout from '~/editor/layout/editor-dashboard'
import CultureEditView from '~/shared/features/cultures/culture_edit_view'
import Culture from '#models/culture'
import { ReactNode } from 'react'

interface EditorCultureEditProps {
    culture: Culture
}

export default function EditorCultureEdit({ culture }: EditorCultureEditProps) {
    return <CultureEditView culture={culture} />
}

EditorCultureEdit.layout = (page: ReactNode) => {
    return (
        <EditorDashboardLayout title="Edit Culture" hideHeader>
            {page}
        </EditorDashboardLayout>
    )
}
