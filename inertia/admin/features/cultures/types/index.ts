export interface AdminCulture {
    id: string
    title: string
    region: string
    mythsCount: number
    status: 'Published' | 'Draft'
    thumbnail: string
    lastUpdated: string
}
