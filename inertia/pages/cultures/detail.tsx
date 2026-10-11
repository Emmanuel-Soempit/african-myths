import { ReactNode } from "react"
import CultureDetailPage from "~/reader/features/culture-detail/page"
import UserLayout from "~/reader/layouts/user_layout"

export default function CultureDetail(props: any) {
  return <CultureDetailPage {...props} />
}

CultureDetail.layout = (page: ReactNode) => (
  <UserLayout bgColor="bg-green-light" title="Culture Detail">
    {page}
  </UserLayout>
)