enum ErrorTypes {
    E_INVALID_CREDENTIALS = 'E_INVALID_CREDENTIALS',
    error = 'error'
}

export default function Error({ errors }: { errors: Record<string, string> }) {
    const error = errors[ErrorTypes.E_INVALID_CREDENTIALS] || errors[ErrorTypes.error]
    return error && (
        <div className="flex flex-col gap-4">
            <p className="text-red-400 mt-2 text-[10px]">{error}</p>
        </div>
    )
}