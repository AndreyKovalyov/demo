import type { Department, Employee, EmployeeSortKey } from '@sigma/domain'
import { EMPLOYEE_SORT_KEYS } from '@sigma/domain'

export function sortEmployees(
  items: Employee[],
  query: URLSearchParams,
  departments: readonly Department[]
) {
  const departmentNames = Object.fromEntries(departments.map((item) => [item.id, item.name]))
  const comparators: Record<EmployeeSortKey, (a: Employee, b: Employee) => number> = {
    name: (a, b) => a.name.localeCompare(b.name, 'ru'),
    departmentId: (a, b) =>
      departmentNames[a.departmentId]!.localeCompare(departmentNames[b.departmentId]!, 'ru'),
    position: (a, b) => a.position.localeCompare(b.position, 'ru'),
    status: (a, b) => a.status.localeCompare(b.status),
    joinedAt: (a, b) => a.joinedAt - b.joinedAt
  }
  const key = EMPLOYEE_SORT_KEYS.find((item) => item === query.get('sort')) ?? 'name'
  const direction = query.get('direction') === 'desc' ? -1 : 1
  const compare = comparators[key]

  return [...items].sort((a, b) => compare(a, b) * direction || a.id.localeCompare(b.id))
}
