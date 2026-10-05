import { VACATION_SORT_KEYS } from '@sigma/domain'
import type { VacationRequest, VacationSortKey, VacationStatus } from '@sigma/domain'

const STATUS_ORDER: Record<VacationStatus, number> = { pending: 0, approved: 1, rejected: 2 }

const comparators: Record<VacationSortKey, (a: VacationRequest, b: VacationRequest) => number> = {
  employeeName: (a, b) => a.employeeName.localeCompare(b.employeeName, 'ru'),
  startDate: (a, b) => a.startDate - b.startDate,
  endDate: (a, b) => a.endDate - b.endDate,
  createdAt: (a, b) => a.createdAt - b.createdAt,
  reason: (a, b) => a.reason.localeCompare(b.reason, 'ru'),
  status: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
}

export function sortVacations(items: VacationRequest[], query: URLSearchParams) {
  const key = VACATION_SORT_KEYS.find((item) => item === query.get('sort')) ?? 'createdAt'
  const direction = query.get('direction') === 'asc' ? 1 : -1
  const compare = comparators[key]

  return [...items].sort((a, b) => compare(a, b) * direction || a.id.localeCompare(b.id))
}
