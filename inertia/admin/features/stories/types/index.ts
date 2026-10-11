export interface AdminStory {
    id: string
    title: string
    culture: string
    author: string
    status: 'Published' | 'Draft' | 'Pending'
    dateAdded: string
}
