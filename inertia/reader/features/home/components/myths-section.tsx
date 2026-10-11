import { usePage } from "@inertiajs/react";
import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { myths_dummy } from "../utils/dummy";
import MythCard from "./myth-card";

export default function MythsSection() {
    const { myths } = usePage().props as any
    const list = myths && myths.length > 0 ? myths : myths_dummy

    return (
        <section>
            <div className="flex items-center justify-between">
                <h2 className="text-text-primary-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Myths That Shape Generations</h2>
                <a className="nav-link-primary" href="#">More</a>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {list.map((m: any) => (
                    <FadeIn key={m.id}>
                        <MythCard myth={m} />
                    </FadeIn>
                ))}
            </StaggerContainer>
        </section>
    )
}