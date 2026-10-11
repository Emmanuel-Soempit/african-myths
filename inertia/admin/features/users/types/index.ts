export interface AdminUser {
    id: string
    name: string
    email: string
    role: 'Administrator' | 'Contributor' | 'Reader'
    joinDate: string
    status: 'Active' | 'Suspended' | 'Pending'
    avatar: string
}
