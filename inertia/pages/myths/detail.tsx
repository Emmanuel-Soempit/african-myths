import { ReactNode } from "react"
import MythDetailPage from "~/reader/features/myth-detail/page"
import UserLayout from "~/reader/layouts/user_layout"

export default function MythDetail(props: any) {
  return <MythDetailPage {...props} />
}

MythDetail.layout = (page: ReactNode) => (
  <UserLayout bgColor="bg-green-light" title="Culture Detail">
    {page}
  </UserLayout>
)