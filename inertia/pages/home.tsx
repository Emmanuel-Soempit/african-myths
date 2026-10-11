import UserHomePage from '~/reader/features/home/page'
import { ReactNode } from 'react'
import UserLayout from '~/reader/layouts/user_layout'

export default function Home(props: any) {
  return (<UserHomePage {...props} />)
}
Home.layout = (page: ReactNode) => (
  <UserLayout title="Home">
    {page}
  </UserLayout>
)