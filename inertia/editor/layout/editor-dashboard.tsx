import { ReactNode } from "react";
import { Link } from "@inertiajs/react";

export default function EditorDashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
    const activeTitle = title || "Editor Dashboard";

    return (
        <div className="editor-theme font-body-md text-body-md min-h-screen w-full flex overflow-hidden  text-[#f0dfd5]">
            {/* SIDEBAR */}
            <aside className="h-screen w-sidebar fixed left-0 top-0 border-r border-border-dark flex flex-col  px-4 z-50">
                <div className="flex items-center gap-3 px-3 pt-5 pb-10">
                    <div className="size-8 text-[var(--color-admin-primary)]">
                        <svg
                            fill="none"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_6_319)">
                                <path
                                    d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                                    fill="currentColor"
                                ></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_6_319">
                                    <rect fill="white" height="48" width="48"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-admin-text-primary-light)] dark:text-[var(--color-admin-text-primary-dark)]">
                        Kólà
                    </h1>
                </div>
                <nav className="flex-grow space-y-2 editor-scrollbar overflow-y-auto">
                    <Link
                        className="flex items-center gap-3 bg-primary-container/20 text-primary font-bold px-4 py-3 rounded-lg transition-all duration-200 ease-in-out"
                        href="/editor/dashboard"
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 text-secondary dark:text-secondary-fixed px-4 py-3 hover:bg-white/10 transition-all duration-200 ease-in-out"
                        href="#"
                    >
                        <span className="material-symbols-outlined">auto_stories</span>
                        <span>Myths</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 text-secondary dark:text-secondary-fixed px-4 py-3 hover:bg-white/10 transition-all duration-200 ease-in-out"
                        href="#"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 text-secondary dark:text-secondary-fixed px-4 py-3 hover:bg-white/10 transition-all duration-200 ease-in-out"
                        href="#"
                    >
                        <span className="material-symbols-outlined">more_horiz</span>
                        <span>Others</span>
                    </Link>
                </nav>
                <div className="mt-auto pt-6 border-t border-border-dark space-y-2">
                    <Link
                        className="flex items-center gap-3 text-secondary dark:text-secondary-fixed px-4 py-3 hover:bg-white/10 transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-label-md font-label-md">Account Settings</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 text-error px-4 py-3 hover:bg-white/10 transition-colors"
                        href="/logout"
                        method="post"
                        as="button"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-label-md font-label-md">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="ml-sidebar flex-grow flex flex-col h-screen overflow-hidden">
                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-40 w-full flex justify-between items-center h-header-height px-10 py-5 backdrop-blur-md border-b border-border-dark transition-opacity">
                    <div className="flex items-center gap-6">
                        <h2 className="font-headline-md text-headline-md text-primary">{activeTitle}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-dark bg-surface hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-secondary">notifications</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-dark bg-surface hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-secondary">help</span>
                        </button>
                        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border-dark">
                            <div className="text-right">
                                <p className="text-label-md font-bold text-on-surface">Olúwa Sola</p>
                                <p className="text-label-sm text-secondary">Senior Editor</p>
                            </div>
                            <img
                                alt="User profile photo"
                                className="w-10 h-10 rounded-full border border-primary/30 object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ8sEc4-LbwzcEeQvRNXs2_sgvt6z_vt0QwZfx8vOJdmLgutZndMdtwKHRF2Adtip-R8C948fv9jwudCkgmJJkBAYO3K_UOWVOGyapEsHg_LCUt8BXM5rStAQgsWFaim2xfsRDWoG3P7pVCzG6RtKQDuE7fJvE6U90rBUq2KlH_4pzb3RtK22sdZfw1SPI-mRsBkTJPv3pHjL6GoMjD4tz_6qCWAelDX3lJlWv4xZcz_ZSRJBNb9LAh3eGnwCMawB5WAEnaNwHYjE"
                            />
                        </div>
                    </div>
                </header>

                {/* CANVAS */}
                <main className="flex-grow overflow-y-auto p-10 editor-scrollbar space-y-10">
                    {children}
                </main>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
                <span className="material-symbols-outlined text-[28px]">add</span>
                <span className="absolute right-full mr-4 bg-surface-dark border border-border-dark px-4 py-2 rounded-lg text-label-md font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-on-surface">
                    Create New Myth Entry
                </span>
            </button>
        </div>
    );
}
