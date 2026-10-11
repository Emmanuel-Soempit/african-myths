
export function SearchBar({ placeholder, hero=false }: { placeholder: string, hero?: boolean }) {
    return (
        <label className={hero ? "flex flex-col min-w-40 h-14 w-full max-w-3xl mx-auto" : "flex flex-col min-w-40 h-10 w-full max-w-64"}>
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-text-secondary-dark flex bg-surface-dark items-center justify-center pl-4 rounded-l-lg">
                    <span className="material-symbols-outlined">search</span>
                </div>
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-surface-dark h-full placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal" placeholder={placeholder} />
            </div>
        </label>
    )
}