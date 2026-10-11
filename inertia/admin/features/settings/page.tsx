import { useState } from 'react'
import SettingsNavItem from './components/settings_nav_item'
import AccountSettings from './components/account_settings'
import PasswordSettings from './components/password_settings'

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('account')

    return (
        <>
            {/* Page Heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Settings
                    </h1>
                    <p className="text-base font-normal text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                        Manage your account and platform settings.
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Settings Navigation Sidebar */}
                <div className="lg:col-span-1">
                    <nav className="flex flex-col gap-1">
                        <SettingsNavItem
                            icon="person"
                            label="Account"
                            active={activeTab === 'account'}
                            onClick={() => setActiveTab('account')}
                        />
                        <SettingsNavItem
                            icon="notifications"
                            label="Notifications"
                            active={activeTab === 'notifications'}
                            onClick={() => setActiveTab('notifications')}
                        />
                        <SettingsNavItem
                            icon="palette"
                            label="Appearance"
                            active={activeTab === 'appearance'}
                            onClick={() => setActiveTab('appearance')}
                        />
                        <SettingsNavItem
                            icon="security"
                            label="Security"
                            active={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                        />
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col gap-8">
                        {activeTab === 'account' && (
                            <>
                                <AccountSettings />
                                <PasswordSettings />
                            </>
                        )}
                        {activeTab === 'notifications' && (
                            <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                                <p className="text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    Notifications settings coming soon...
                                </p>
                            </div>
                        )}
                        {activeTab === 'appearance' && (
                            <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                                <p className="text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    Appearance settings coming soon...
                                </p>
                            </div>
                        )}
                        {activeTab === 'security' && (
                            <div className="rounded-xl border border-[var(--color-admin-border-light)] bg-[var(--color-admin-surface-light)] p-6 dark:border-[var(--color-admin-border-dark)] dark:bg-[var(--color-admin-surface-dark)]">
                                <p className="text-[var(--color-admin-text-secondary-light)] dark:text-[var(--color-admin-text-secondary-dark)]">
                                    Security settings coming soon...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
