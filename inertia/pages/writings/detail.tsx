import { ReactNode } from "react"
import WritingDetailPage from "~/reader/features/writing-detail/page"
import UserLayout from "~/reader/layouts/user_layout"

export default function WritingDetail(props: any) {
  return <WritingDetailPage {...props} />
}

WritingDetail.layout = (page: ReactNode) => (
  <UserLayout bgColor="bg-green-light" title="Writing">
    {page}
  </UserLayout>
)
