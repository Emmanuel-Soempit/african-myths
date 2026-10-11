import { useEffect, useState } from "react";

export default function TableOfContent({ contents, title, thumbnail }: { contents: string[], title?: string, thumbnail?: string }) {
    const [activeHash, setActiveHash] = useState('');

    useEffect(() => {
        const handleHashChange = () => {
            setActiveHash(window.location.hash.replace('#', ''));
        };

        // Set initial hash
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const displayTitle = title || "Yoruba Culture";
    const displayThumbnail = thumbnail || "https://lh3.googleusercontent.com/aida-public/AB6AXuAQeWq6iZbmJvdXP_jd37B_LhLdeXBZJD83UCrdAbAX3T2Bwsroiljljw4hXFhdu7qAqqwpkqx4S_F7EsaCVItIbjF0yAqOkRaVHWLvbMlvJhQrCU0Lq5BkgDz4oJs2Vsly9ACBmTJC8hImTJm-sX-6sf7AD6nHLpIIdZC6ST9YHKxEjtJppPg6LUdJrijtUDmf_kiGixqoBegX6jsMmRzDF3p68LSp2CEQs3_W0UvVHhKFr_qQC6PQWNjVHOHPo3cR-Rf4ErZpdn4";

    return (
        <aside className="w-full lg:w-64 lg:sticky top-24 self-start">
            <div className="flex h-full flex-col justify-between rounded-lg bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-center">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0"
                        style={{
                            backgroundImage: `url("${displayThumbnail}")`
                        }}
                        data-alt={`${displayTitle} cultural symbol`}
                    />                        <div className="flex flex-col min-w-0">
                        <h1 className="text-stone-900 dark:text-white text-base font-bold font-display leading-normal truncate">{displayTitle}</h1>
                        <p className="text-stone-600 dark:text-stone-400 text-sm font-normal leading-normal">Table of Contents</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {
                        contents.map((content, index) => {
                            const isActive = content.toLowerCase() === activeHash;

                            return (
                                <a
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                        ? 'bg-primary/20 text-primary dark:bg-primary/20'
                                        : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                                        }`}
                                    href={`#${content.toLowerCase()}`}>
                                    <span className="material-symbols-outlined !text-xl ">{index === 0 ? 'history_edu' : index === 1 ? 'translate' : index === 2 ? 'auto_stories' : 'download'}</span>
                                    <p className=" text-sm font-medium leading-normal">{content.split('')[0].toUpperCase() + content.slice(1)}</p>
                                </a>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </aside>
)
}