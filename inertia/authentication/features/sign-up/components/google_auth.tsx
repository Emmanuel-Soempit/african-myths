import { FcGoogle } from "react-icons/fc"; // Original colors

export default function GoogleAuth({
    text = 'Sign up with Google',
}: {
    text?: string
}) {
    return (
        <button
            onClick={() => {
                window.location.href = '/api/v1/google-sign-in'
            }}
            className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-5 text-base font-medium leading-normal text-[var(--color-brown-secondary)] dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <FcGoogle className="h-5 w-5" />
            <span className="truncate">{text}</span>
        </button>
    )
}
