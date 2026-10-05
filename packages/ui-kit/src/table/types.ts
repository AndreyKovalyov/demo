/** Ключ колонки проверяется по типу строки. */
export interface TableColumn<T> {
  key: keyof T & string
  label: string
  sort?: true | string | ((a: T, b: T) => number)
}

export interface TableSort {
  key: string
  direction: 'asc' | 'desc'
}

export interface TablePaginationLabels {
  label: string
  previous: string
  next: string
  pageSize: string
}

export type TableFilter =
  | { key: string; type: 'text'; label: string; placeholder?: string }
  | {
      key: string
      type: 'select'
      label: string
      options: readonly { value: string; label: string }[]
    }

export type TableCellSlots<T> = {
  [name: `cell-${string}`]: (props: { row: T; value: T[keyof T] }) => unknown
  actions?: (props: { row: T }) => unknown
}

export type DataTableSlots<T> = TableCellSlots<T> & {
  filters?: () => unknown
  'filter-summary'?: () => unknown
  toolbar?: () => unknown
  feedback?: () => unknown
  error?: (props: { error: string }) => unknown
  pagination?: () => unknown
}
