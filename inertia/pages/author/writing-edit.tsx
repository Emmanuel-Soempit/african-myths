import AuthorDashboardLayout from '~/author/layout/author-dashboard'
import WritingEditView from '~/shared/features/writings/writing_edit_view'
import { ReactNode } from 'react'
import { Writing, WritingType } from '~/types/writing'

interface AuthorWritingEditProps {
    writing: Writing | null
    type?: WritingType
    readOnly?: boolean
}

export default function AuthorWritingEdit({ writing, type, readOnly }: AuthorWritingEditProps) {
    return <WritingEditView writing={writing} type={type} readOnly={readOnly} mode="author" />
}

AuthorWritingEdit.layout = (page: ReactNode) => {
    return (
        <AuthorDashboardLayout title="Writing" hideHeader>
            {page}
        </AuthorDashboardLayout>
    )
}
