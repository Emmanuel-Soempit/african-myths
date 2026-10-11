import LeftSection from './components/left_section'
import RightSection from './components/right_section'
import FadeIn from '~/shared/ui/animations/fade_in'

export default function SignInPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[var(--color-beige-light)] dark:bg-[var(--color-brown-black)]">
            <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
                <FadeIn className="hidden h-full w-full lg:block">
                    <LeftSection />
                </FadeIn>
                <FadeIn delay={0.2} className="flex w-full items-center justify-center">
                    <RightSection />
                </FadeIn>
            </div>
        </div>
    )
}
