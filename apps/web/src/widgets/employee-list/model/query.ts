import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import { departmentId, EMPLOYEE_SORT_KEYS } from '@/entities/employee'
import type { EmployeeQuery } from '@/entities/employee'

export const PAGE_SIZES = [16, 32, 50]
export const DEFAULT_PAGE_SIZE = 16
export const SEARCH_DELAY_MS = 250

export type EmployeeQueryPatch = Partial<
  Record<
    'page' | 'pageSize' | 'search' | 'department' | 'status' | 'sort' | 'direction',
    string | number
  >
>

export function readEmployeeQuery(query: LocationQuery | LocationQueryRaw): EmployeeQuery {
  return {
    page: Math.max(1, Math.min(10000, Math.floor(Number(query.page) || 1))),
    pageSize: PAGE_SIZES.includes(Number(query.pageSize))
      ? Number(query.pageSize)
      : DEFAULT_PAGE_SIZE,
    search: typeof query.search === 'string' ? query.search.slice(0, 100) : '',
    departmentId: typeof query.department === 'string' ? departmentId(query.department) : '',
    status: query.status === 'active' || query.status === 'on-vacation' ? query.status : '',
    sort: EMPLOYEE_SORT_KEYS.find((key) => key === query.sort) ?? 'name',
    direction: query.direction === 'desc' ? 'desc' : 'asc'
  }
}

export function mergeEmployeeQuery(
  query: LocationQueryRaw,
  patch: EmployeeQueryPatch,
  resetPage: boolean
): LocationQueryRaw {
  const next: LocationQueryRaw = { ...query, ...(resetPage ? { page: undefined } : {}), ...patch }

  for (const key of Object.keys(next)) {
    if (
      next[key] === '' ||
      next[key] === undefined ||
      (key === 'page' && String(next[key]) === '1')
    ) {
      delete next[key]
    }
  }

  return next
}

export function writeEmployeeQuery(query: EmployeeQuery): LocationQueryRaw {
  return mergeEmployeeQuery(
    {},
    {
      page: query.page,
      ...(query.pageSize !== DEFAULT_PAGE_SIZE ? { pageSize: query.pageSize } : {}),
      search: query.search,
      department: query.departmentId,
      status: query.status,
      ...(query.sort !== 'name' ? { sort: query.sort } : {}),
      ...(query.direction !== 'asc' ? { direction: query.direction } : {})
    },
    false
  )
}
