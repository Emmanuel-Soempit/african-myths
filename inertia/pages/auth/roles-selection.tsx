import Role from '#models/role'
import RolesSelectionPage from '~/authentication/features/roles-selection/page'

export default function RolesSelection({ roles }: { roles: Role[] }) {
    console.log('Roles:', roles)
    return <RolesSelectionPage roles={roles} />
}
