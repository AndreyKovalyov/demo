import type { TableColumn, TableSort } from './types'

export function columnSortKey<T>(column: TableColumn<T>): string | null {
  if (!column.sort) {
    return null
  }

  return typeof column.sort === 'string' ? column.sort : column.key
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  return String(a ?? '').localeCompare(String(b ?? ''))
}

export function sortTableRows<T>(
  rows: readonly T[],
  columns: readonly TableColumn<T>[],
  sort: TableSort | null
): readonly T[] {
  const column = columns.find((item) => columnSortKey(item) === sort?.key)
  if (!sort || !column) {
    return rows
  }

  const compare =
    typeof column.sort === 'function'
      ? column.sort
      : (a: T, b: T) => compareValues(a[column.key], b[column.key])
  const direction = sort.direction === 'asc' ? 1 : -1

  return [...rows].sort((a, b) => compare(a, b) * direction)
}
