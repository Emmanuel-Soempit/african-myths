import { Link } from "@inertiajs/react";

export default function PageHeading({ myth }: { myth: any }) {

    return (
        <>
            <div className="flex flex-col gap-4 mb-8">
                <Link className="font-sans inline-block w-fit rounded-full bg-[#BC6C25]/20 px-4 py-1 text-sm font-medium text-[#BC6C25] hover:bg-[#BC6C25]/30 transition-colors"
                    href={`/cultures/${myth?.culture?.id}`}>{myth?.culture?.name}</Link>
                <h1 className="font-sans text-[#2D2D2D] dark:text-white text-4xl md:text-5xl font-bold tracking-tighter">{myth?.title}</h1>
            </div>
            <div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-gray-200 dark:border-gray-800 py-4 mb-12">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 font-sans">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>{myth?.time}</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex flex-wrap items-center gap-2">
                    {myth?.tags?.map((t: string, i: number) =>
                    <div key={i} className="flex items-center justify-center rounded-lg bg-[#3A5A40]/10 dark:bg-[#3A5A40]/20 px-3 py-1">
                        <p className="font-sans text-[#3A5A40] dark:text-green-200 text-xs font-medium">{t}</p>
                    </div>
                    )}
                </div>
            </div>
        </>
    )
}