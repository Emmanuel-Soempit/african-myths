import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { url } = usePage();

    const items = [
        { label: 'Dashboard', href: '/editor/dashboard', icon: 'dashboard' },
        { label: 'Myths', href: '#', icon: 'auto_stories' },
        { label: 'Settings', href: '#', icon: 'settings' },
        { label: 'Others', href: '#', icon: 'more_horiz' },
    ];

    return (
        <aside className="flex w-64 flex-col border-r border-border-dark bg-surface p-4">
            <div className="flex items-center gap-3 px-3 pt-5 pb-10">
                <div className="size-8 text-[#ffb77d]">
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
                <h1 className="font-display text-2xl font-bold text-on-surface">
                    Kólà
                </h1>
            </div>
            <div className="flex h-full flex-col justify-between pt-8">
                <div className="flex flex-col gap-2">
                    {items.map((item) => {
                        const isActive = url.includes(item.href) && item.href !== '#';
                        return (
                            <Link
                                key={item.label}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'bg-primary-container/20 text-primary font-bold'
                                        : 'text-secondary hover:bg-white/10'
                                }`}
                                href={item.href}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="flex flex-col gap-1 border-t border-border-dark pt-6 mt-auto">
                    <Link
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-secondary hover:bg-white/10 transition-colors"
                        href="#"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-label-md font-label-md">Account Settings</span>
                    </Link>
                    <Link
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-error hover:bg-white/10 transition-colors"
                        href="/api/v1/sign-out"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-label-md font-label-md">Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
