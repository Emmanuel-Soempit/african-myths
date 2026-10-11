export default function StatCard({ value, name }: { value: string, name: string }) {
  return <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
    <p className="text-stone-600 dark:text-stone-400 text-sm font-medium leading-normal">{name}</p>
    <p className="text-stone-900 dark:text-white tracking-tight text-2xl font-bold leading-tight font-display">{value}</p>
  </div>
}