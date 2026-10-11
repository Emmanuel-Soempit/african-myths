import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  accessor: (item: T) => any
  render?: (value: any, item: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface PaginationMeta {
  total: number
  currentPage: number
  perPage: number
  lastPage?: number
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  meta: PaginationMeta
  title?: string
  totalLabel?: string
  onPageChange?: (page: number) => void
  onSort?: (columnKey: string) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  renderActions?: (item: T, index: number) => ReactNode
  filters?: ReactNode
  getRowKey: (item: T, index: number) => string | number
}
