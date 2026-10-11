import FadeIn from "~/shared/ui/animations/fade_in";
import { StaggerContainer } from "~/shared/ui/animations/stagger_container";
import { collections_dummy } from "../utils/dummy";
import CollectionCard from "./collection-card";

export default function CollectionsSection() {
    return (
        <section>
            <div className="flex items-center justify-between">
                <h2 className="text-text-primary-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                    Newly Curated Collections
                </h2>
                <a className="nav-link-primary" href="#">More</a>
            </div>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-4">
                {collections_dummy.map(collection => (
                    <FadeIn key={collection.id}>
                        <CollectionCard collection={collection} />
                    </FadeIn>
                ))}
            </StaggerContainer>
        </section>
    );
}