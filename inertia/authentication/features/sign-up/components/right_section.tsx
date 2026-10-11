import GoogleAuth from './google_auth'
import SignUpForm from './sign_up_form'

export default function RightSection() {
    return (
        <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:p-12 bg-[var(--color-beige-light)] dark:bg-[var(--color-brown-black)]">
            <div className="flex w-full max-w-md flex-col justify-center">
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

                {/* Form Content */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 text-left">
                        <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-[var(--color-brown-secondary)] dark:text-white sm:text-4xl">
                            Discover the Stories of a Continent
                        </h2>
                        <p className="text-sm text-[var(--color-brown-secondary)]/70 dark:text-gray-400 sm:text-base">
                            Join Kólà to explore thousands of myths and tales from across Africa.
                        </p>
                    </div>

                    <GoogleAuth />

                    <div className="relative my-4 flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                        <span className="mx-4 flex-shrink text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                            OR
                        </span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                    </div>

                    <SignUpForm />
                </div>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        By creating an account, you agree to our{' '}
                        <a className="font-medium text-[var(--color-orange-primary)] hover:underline" href="#">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a className="font-medium text-[var(--color-orange-primary)] hover:underline" href="#">
                            Privacy Policy
                        </a>
                        .
                    </p>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <a className="font-medium text-[var(--color-orange-primary)] hover:underline" href="/auth/sign-in">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
