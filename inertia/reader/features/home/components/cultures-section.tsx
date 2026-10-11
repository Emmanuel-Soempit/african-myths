import { usePage } from "@inertiajs/react";
import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { cultures_dummy } from "../utils/dummy";
import CultureCard from "./culture-card";

export default function CulturesSection() {
    const { cultures } = usePage().props as any
    const list = cultures && cultures.length > 0 ? cultures : cultures_dummy

    return <section className="">
        <div className="flex items-center justify-between">
            <h2 className="text-text-primary-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Explore Rich Cultures</h2>
            <a className="nav-link-primary" href="#">More</a>
        </div>


        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StaggerContainer className="grid grid-cols-5 items-stretch p-4 gap-6">
                {list.map((c: any) => (
                    <FadeIn key={c.id}>
                        <CultureCard culture={c} />
                    </FadeIn>
                ))}
            </StaggerContainer>
        </div>
    </section>
}