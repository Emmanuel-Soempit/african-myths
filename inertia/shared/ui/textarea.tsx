import { TextareaHTMLAttributes, ReactNode } from 'react'

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
    | 'admin-primary'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    rightElement?: ReactNode
    variant?: Variant
    errors: Record<string, string>
    setError: (name: string, error: string) => void
}

export default function TextArea({
    label,
    rightElement,
    className,
    variant = 'green-light',
    errors,
    setError,
    ...props
}: TextAreaProps) {
    const error = (props?.name && errors[props.name]) || null

    const textareaElement = (
        <div className="relative">
            <textarea
                onChange={(e) => {
                    if (props?.name) {
                        setError(props?.name, '')
                    }
                }}
                className={`form-textarea w-full flex-1 resize-none overflow-hidden rounded-lg bg-transparent border p-3 text-sm font-normal leading-normal text-[var(--color-brown-secondary)] placeholder:text-gray-400 focus:outline-none focus:ring-1 ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400 dark:border-red-400' : 'border-gray-300 focus:border-[var(--focus-color)] focus:ring-[var(--focus-color)] dark:border-gray-600'} dark:text-white dark:placeholder:text-gray-500 ${className || ''}`}
                style={{ '--focus-color': `var(--color-${variant})` } as React.CSSProperties}
                {...props}
            />
            {rightElement}
        </div>
    )

    if (!label) {
        return textareaElement
    }

    return (
        <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium text-[var(--color-brown-secondary)] dark:text-gray-300">
                {label}
            </p>
            {textareaElement}
            {error && <p className="text-red-400 mt-2 text-[10px]">{error}</p>}
        </label>
    )
}