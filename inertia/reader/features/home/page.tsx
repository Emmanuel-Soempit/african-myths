import FadeIn from "~/shared/ui/animations/fade_in";
import { Hero, CulturesSection, MythsSection, CollectionsSection } from "./components";


export function UserHomePage() {
  return (
    <main className="flex flex-col gap-12 sm:gap-16 md:gap-20  px-4 sm:px-10 lg:px-8">
      <FadeIn>
        <Hero />
      </FadeIn>
      <CulturesSection />
      <MythsSection />
      <CollectionsSection />
    </main>
  )
}

export default UserHomePage;