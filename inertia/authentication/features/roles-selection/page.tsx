import RoleCard from './components/role_card'
import FadeIn from '~/shared/ui/animations/fade_in'
import {
    StaggerContainer,
    StaggerItem,
} from '~/shared/ui/animations/stagger_container'
import Button from '~/shared/ui/button'
import { useEffect, useState } from 'react'
import Role from '#models/role'
import { Link, router, usePage } from '@inertiajs/react'
import toast from 'react-hot-toast'

export default function RolesSelectionPage({ roles }: { roles: Role[] }) {
    const { props } = usePage()
    const user = props.user as any
    const [loading, setLoading] = useState(false)

    console.log('Logged in user:', user, props)

    const [selectedRole, setSelectedRole] = useState<Role | null>(user?.metadata?.role)


    const handleAssignRole = () => {
        if (!selectedRole) return
        // Send the POST request
        router.post('/api/v1/assign-role', {
            roleId: selectedRole.id
        }, {
            onStart: () => {
                setLoading(false)
            },
            onFinish: () => {
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        if (props?.errors?.error) {
            toast.error(props.errors.error)
        }
    }, [props])

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[var(--color-roles-bg-light)] dark:bg-[var(--color-roles-bg-dark)] font-sans text-[var(--color-roles-text-light)] dark:text-[var(--color-roles-text-dark)]">
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615529182902-959c25b3c333?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
                    data-alt="Abstract background pattern inspired by African textile art"
                ></div>
            </div>

            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
                <FadeIn>
                    <h1 className="font-display tracking-tight text-4xl sm:text-5xl font-medium leading-tight text-center pb-2 pt-6">
                        How will you join our story?
                    </h1>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <p className="text-base font-normal leading-normal pb-8 pt-1 text-center text-[var(--color-roles-muted-light)] dark:text-[var(--color-roles-muted-dark)]">
                        Choose your primary role to get started. You can explore other roles later.
                    </p>
                </FadeIn>

                <StaggerContainer className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 pb-8">
                    {roles.map((role) => (
                        <StaggerItem key={role.id}>
                            <RoleCard
                                icon={role.icon}
                                title={role.name}
                                description={role.description}
                                selected={selectedRole?.id === role.id}
                                onClick={() => setSelectedRole(role)}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                <FadeIn delay={0.4} className="flex w-full max-w-xs flex-col items-center justify-center px-4 py-3">
                    <Button
                        variant="roles-primary"
                        className="rounded-full text-lg tracking-wide shadow-lg"
                        onClick={handleAssignRole}
                        loading={loading}
                    >
                        <span className="truncate">Continue as {selectedRole?.name}</span>
                    </Button>
                </FadeIn>

                <FadeIn delay={0.5}>
                    <Link
                        href={'/'}
                        className="cursor-pointer text-sm font-normal leading-normal text-[var(--color-roles-muted-light)] underline transition hover:text-[var(--color-roles-primary)] dark:text-[var(--color-roles-muted-dark)] dark:hover:text-[var(--color-roles-primary)] pb-3 pt-1 text-center">
                        Skip for now
                    </Link>
                </FadeIn>
            </div>
        </div>
    )
}
