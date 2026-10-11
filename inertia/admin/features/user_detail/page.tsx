import UserDetailHeader from './components/user_detail_header'
import UserPersonalInfo from './components/user_personal_info'
import UserProfileHeader from './components/user_profile_header'
import UserRoles from './components/user_roles'
import UserStatus from './components/user_status'

export default function UserDetailView() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-[var(--color-admin-background-light)] dark:bg-[var(--color-admin-background-dark)]">
            <UserDetailHeader />
            <div className="p-10">
                <div className="mx-auto max-w-4xl">
                    <UserProfileHeader />
                    <div className="mt-12">
                        <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                            <div className="divide-y divide-[var(--color-admin-border-light)] dark:divide-[var(--color-admin-border-dark)]">
                                <UserPersonalInfo />
                                <UserRoles />
                                <UserStatus />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
