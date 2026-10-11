import { useState } from 'react'
import Button from '~/shared/ui/button'
import Input from '~/shared/ui/input'
import { Form } from '@inertiajs/react'
import { toast } from 'react-hot-toast'

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    roles: Array<{ id: string; name: string }>
}

export default function AddUserModal({ isOpen, onClose, roles }: AddUserModalProps) {
    const [invitationUrl, setInvitationUrl] = useState<string | null>(null)
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)

    if (!isOpen) return null

    const handleCopyToClipboard = () => {
        if (invitationUrl) {
            navigator.clipboard.writeText(invitationUrl)
            setCopiedToClipboard(true)
            toast.success('Invitation link copied to clipboard!')
            setTimeout(() => setCopiedToClipboard(false), 2000)
        }
    }

    const handleClose = () => {
        setInvitationUrl(null)
        setCopiedToClipboard(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-dark)] p-6 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-dark)]">
                            {invitationUrl ? 'Invitation Created!' : 'Invite a New User'}
                        </h2>
                        <p className="text-sm text-[var(--color-admin-text-secondary-dark)]">
                            {invitationUrl
                                ? 'Share this link with the new user'
                                : 'Generate a unique invitation link for a new user.'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[var(--color-admin-text-secondary-dark)] hover:text-[var(--color-admin-text-primary-dark)]"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {!invitationUrl ? (
                    <Form
                        showProgress
                        disableWhileProcessing
                        onSuccess={(page: any) => {
                            const invitation = page.props?.flash?.invitation
                            console.log('Page props', page)
                            if (invitation?.url) {
                                setInvitationUrl(invitation.url)
                                toast.success('Invitation created successfully!')
                            }
                        }}
                        onError={(errors: any) => {
                            if (errors.error) {
                                toast.error(errors.error)
                            } else {
                                toast.error('Failed to create invitation')
                            }
                        }}
                        action="/api/v1/admin/invite_user"
                        className="mt-6 space-y-4"
                        method="POST"
                    >
                        {({ errors, setError, processing }) => (
                            <>
                                <Input
                                    label="First Name"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter user's first name"
                                    type="text"
                                    variant="admin-primary"
                                    errors={errors}
                                    setError={setError}
                                />
                                <Input
                                    label="Last Name"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter user's last name"
                                    type="text"
                                    variant="admin-primary"
                                    errors={errors}
                                    setError={setError}
                                />
                                <Input
                                    label="Email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter user's email address"
                                    type="email"
                                    variant="admin-primary"
                                    errors={errors}
                                    setError={setError}
                                />
                                <div>
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-[var(--color-admin-text-primary-dark)]"
                                        htmlFor="roleId"
                                    >
                                        Role
                                    </label>
                                    <select
                                        className="form-select w-full appearance-none rounded-lg border-[var(--color-admin-border-dark)] bg-[var(--color-admin-background-dark)] px-4 py-2 text-[var(--color-admin-text-primary-dark)] focus:border-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                                        id="roleId"
                                        name="roleId"
                                        required
                                    >
                                        <option value="">Select a role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roleId && (
                                        <p className="mt-1 text-xs text-red-400">{errors.roleId}</p>
                                    )}
                                </div>

                                {errors.error && (
                                    <p className="text-sm text-red-400">{errors.error}</p>
                                )}

                                <div className="pt-4">
                                    <Button
                                        variant="admin-primary"
                                        className="w-full justify-center gap-2"
                                        type="submit"
                                        disabled={processing}
                                        loading={processing}
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            link
                                        </span>
                                        <span>Generate Link</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                ) : (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-[var(--color-admin-background-dark)] p-4">
                            <p className="mb-2 text-xs font-medium text-[var(--color-admin-text-secondary-dark)]">
                                Invitation Link
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 overflow-x-auto text-xs text-[var(--color-admin-text-primary-dark)]">
                                    {invitationUrl}
                                </code>
                                <button
                                    onClick={handleCopyToClipboard}
                                    className="flex-shrink-0 rounded-lg bg-[var(--color-admin-primary)] px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                                >
                                    {copiedToClipboard ? (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">
                                                check
                                            </span>
                                            Copied
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">
                                                content_copy
                                            </span>
                                            Copy
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg border border-[var(--color-admin-border-dark)] bg-[var(--color-admin-surface-dark)] p-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[var(--color-admin-primary)]">
                                    info
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm text-[var(--color-admin-text-primary-dark)]">
                                        This invitation link will expire in 7 days. The user can use it
                                        to create their account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="admin-primary"
                            className="w-full justify-center"
                            onClick={handleClose}
                        >
                            Done
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
