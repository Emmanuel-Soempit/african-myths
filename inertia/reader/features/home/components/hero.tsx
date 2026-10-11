import { SearchBar } from "~/shared/ui/search-bar";

export default function Header() {
    return (
        <div className="flex items-center w-full flex-col gap-10">
            <div className="@container mt-8 font-display w-full max-w-6xl hero_anim">
                <div className="@[480px]:p-4">
                    <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat hero-header-bg @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 text-center" data-alt="Abstract gradient background with earthy and deep tones.">
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                                Discover the Stories of a Continent
                            </h1>
                            <h2 className="text-white text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                                Journey through a rich tapestry of African myths, legends, and folklore passed down through generations.
                            </h2>
                        </div>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                            <span className="truncate">Start Exploring</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-4 w-full">
                <SearchBar hero placeholder='Search for a myth, culture, or story...' />
            </div>
        </div>
    )
}