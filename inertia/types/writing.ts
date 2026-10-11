export type WritingType = 'poem' | 'story' | 'article'
export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'

export interface Writing {
  id: string
  type: WritingType
  title: string
  excerpt: string | null
  content: string
  thumbnail: string | null
  cultureId: string
  culture?: { id: string; name: string } | null
  authorId: string
  author?: {
    profile?: { firstName?: string; lastName?: string }
  } | null
  status: ContentStatus
  reviewNote: string | null
  reviewedBy?: string | null
  reviewer?: {
    profile?: { firstName?: string; lastName?: string }
  } | null
  publishedAt: string | null
  minutesToRead: number
  createdAt: string
  updatedAt: string
}
