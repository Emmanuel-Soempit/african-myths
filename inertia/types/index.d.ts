export interface TableMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}
export interface TableData<T> {
  meta: TableMeta
  data: T
}


export interface SelectorOption {
    value: string
    label: string
}