export default function ContentHeader({ summary, thumbnail, title }: { summary: string, thumbnail: string, title: string }) {
    return <div className="@container mb-12">
        <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-4"
            data-alt="Vibrant portrait of a Yoruba woman in traditional attire"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(17, 33, 17, 0.8) 100%), url("${thumbnail}")`
            }}
        >
            <div className="flex flex-col gap-4 text-center max-w-2xl">
                <h1 className="text-white text-4xl font-black font-display leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">{title}</h1>
                <h2 className="text-stone-200 text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed">{summary}</h2>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[-0.01em]">
                <span className="truncate">Explore Stories</span>
            </button>
        </div>
    </div>
}