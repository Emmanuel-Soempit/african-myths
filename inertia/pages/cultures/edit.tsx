import CultureEditView from '~/shared/features/cultures/culture_edit_view'
import Culture from '#models/culture'
import { ReactNode } from 'react'

interface CultureEditProps {
    culture: Culture
}

export default function CultureEdit({ culture }: CultureEditProps) {
    return <CultureEditView culture={culture} />
}

// CultureEdit.layout = (page: ReactNode) => (
//   <UserLayout bgColor="bg-green-light" title="Culture Edit">
//     {page}
//   </UserLayout>
// )