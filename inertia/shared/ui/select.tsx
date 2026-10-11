import { ReactNode, useState, useCallback, useEffect } from 'react'
import ReactSelect from 'react-select'

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

interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    label?: string
    rightElement?: ReactNode
    variant?: Variant
    errors: Record<string, string>
    setError: (name: string, error: string) => void
    options?: Array<{ value: string; label: string }>
    value?: string
    onChange?: (e: { target: { value: string } }) => void
    name?: string
    id?: string
    disabled?: boolean
    placeholder?: string
    className?: string
    defaultValue?: string
    // Async loading props
    isAsync?: boolean
    loadOptions?: (inputValue: string) => Promise<Array<{ value: string; label: string }>>
    loadDefaultOption?: (id: string) => Promise<Array<{ value: string; label: string }>>
}

export default function Select({
    label,
    rightElement,
    className,
    variant = 'green-light',
    errors,
    setError,
    options,
    onChange,
    name,
    id,
    disabled,
    placeholder,
    isAsync = false,
    loadOptions,
    defaultValue,
    loadDefaultOption,
    value
}: SelectProps) {
    const error = (name && errors[name]) || null

    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)
    const [defaultOption, setDefaultOption] = useState<SelectOption[]>([])

    useEffect(() => {
        if (value && options && !isAsync) {
            const found = options.find(opt => opt.value === value)
            if (found) {
                setSelectedOption(found)
            }
        }
    }, [value, options, isAsync])

    const handleChange = (selectedOption: SelectOption | null) => {
        const newValue = selectedOption?.value || ''
        if (name) {
            setError(name, '')
        }
        if (selectedOption) {
            setSelectedOption(selectedOption)
            onChange?.({ target: { value: newValue } })
        } else if (!selectedOption && defaultOption.length > 0) {
            setSelectedOption(defaultOption[0])
        }
    }

    // Async loading logic
    const [isLoading, setIsLoading] = useState(false)
    const [asyncOptions, setAsyncOptions] = useState<Array<SelectOption>>([])

    const handleInputChange = useCallback((newValue: string) => {
        if (!isAsync || !loadOptions || newValue.length < 2) {
            setAsyncOptions([])
            return
        }

        console.log('Loading options')

        setIsLoading(true)
        loadOptions(newValue).then(options => {
            setAsyncOptions(options)
        }).catch(() => {
            console.error('Error loading options:', error)
            setAsyncOptions([])
        }).finally(() => {
            setIsLoading(false)
        })
    }, [isAsync, loadOptions])

    const finalOptions = isAsync ? asyncOptions : options || []

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            borderColor: error ? 'rgb(248 113 113)' : 'rgb(209 213 219)',
            '&:hover': {
                borderColor: error ? 'rgb(248 113 113)' : `var(--color-${variant})`,
            },
            '&:focus-within': {
                borderColor: error ? 'rgb(248 113 113)' : `var(--color-${variant})`,
                boxShadow: error ? '0 0 0 1px rgb(248 113 113)' : `0 0 0 1px var(--color-${variant})`,
            },
            backgroundColor: 'transparent',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            minHeight: '2.75rem',
            color: 'white',
            '&:focus': {
                backgroundColor: 'transparent',
            },
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? `var(--color-${variant})` : 'white',
            color: state.isFocused ? 'white' : 'var(--color-brown-secondary)',
            '&:hover': {
                backgroundColor: `var(--color-${variant})`,
                color: 'white',
            },
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'white',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'rgb(156 163 175)',
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--color-surface-light)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }),
    }

    useEffect(() => {
        if (defaultValue) {
            setIsLoading(true)
            console.log('Default value', defaultValue)

            if (defaultOption.length > 0) {
                setSelectedOption(defaultOption[0])
                setIsLoading(false)
                return
            }
            loadDefaultOption!(defaultValue).then(option => {
                console.log('Default option', option, finalOptions)
                setDefaultOption(option)
                setSelectedOption(option[0])
            })
            setIsLoading(false)
        }
    }, [defaultValue])


    const selectElement = (
        <div className="relative">
            <ReactSelect
                styles={selectStyles}
                options={finalOptions.length > 0 ? finalOptions : defaultOption}
                value={selectedOption}
                onChange={handleChange}
                placeholder={placeholder || "Select an option"}
                isClearable
                name={name}
                isDisabled={disabled}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                filterOption={isAsync ? null : undefined}
                className={`react-select-container text-white ${className || ''}`}
                classNamePrefix="react-select"
                id={id}
                onMenuClose={() => {
                    if (defaultOption) {
                        setSelectedOption(defaultOption[0])
                    }
                }}

            />
            {rightElement}
        </div>
    )

    if (!label) {
        return selectElement
    }

    return (
        <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium text-[var(--color-brown-secondary)] dark:text-gray-300">
                {label}
            </p>
            {selectElement}
            {error && <p className="text-red-400 mt-2 text-[10px]">{error}</p>}
        </label>
    )
}
