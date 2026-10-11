import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant =
    | 'green-light'
    | 'green-gray'
    | 'green-dark'
    | 'brown-light'
    | 'brown-gray'
    | 'brown-dark'
    | 'orange-primary'
    | 'brown-secondary'
    | 'beige-light'
    | 'brown-black'
    | 'roles-primary'
    | 'admin-primary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    children: ReactNode
    loading?: boolean
}

export default function Button({
    variant = 'green-light',
    className,
    children,
    style,
    loading = false,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-background-dark ${className || ''}`}
            style={{
                backgroundColor: `var(--color-${variant})`,
                '--tw-ring-color': `var(--color-${variant})`,
                ...style,
            } as React.CSSProperties}
            {...props}
        >
            {loading ? (
                <span className="material-symbols-outlined animate-spin">
                    progress_activity
                </span>
            ) : (
                children
            )}
        </button>
    )
}
