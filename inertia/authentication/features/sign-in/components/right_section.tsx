import SignInForm from './sign_in_form'
import GoogleAuth from '~/authentication/features/sign-up/components/google_auth'
import FadeIn from '~/shared/ui/animations/fade_in'

export default function RightSection() {
    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center bg-[var(--color-beige-light)] dark:bg-[var(--color-brown-black)]">
            <div className="flex w-full max-w-md flex-col items-center justify-center p-6 sm:p-10">
                <FadeIn className="w-full text-left mb-8">
                    {/* Header */}
                    <header className="mb-8 flex items-center gap-3">
                        <div className="size-8 text-[var(--color-orange-primary)]">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
                        <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-[var(--color-brown-secondary)] dark:text-white">
                            Kólà
                        </h1>
                    </header>

                </FadeIn>

                <div className="flex w-full flex-col gap-6">
                    <FadeIn delay={0.1} className="text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-brown-secondary)] dark:text-[var(--color-beige-light)] sm:text-4xl">
                            Welcome Back
                        </h1>
                    </FadeIn>

                    <SignInForm />

                    <FadeIn delay={0.3} className="flex flex-col gap-3">
                        <GoogleAuth text="Sign in with Google" />
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <a
                                    className="font-medium text-[var(--color-orange-primary)] underline hover:text-opacity-80"
                                    href="/auth/sign-up"
                                >
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    )
}
