import type { Employee, EmployeePatch } from '@sigma/domain'
import { canAccess } from '@sigma/domain/access'
import type { AppAbility } from '@sigma/domain/access'
import type { MockState } from './state'

export function visibleEmployee(employee: Employee, ability: AppAbility): Employee {
  if (canAccess(ability, 'readSalary', 'Employee', employee)) {
    return employee
  }

  const { salary, ...rest } = employee
  void salary

  return rest
}

export function filterEmployees(items: Employee[], query: URLSearchParams) {
  const needle = (query.get('search') ?? '').trim().toLocaleLowerCase('ru')
  const departmentId = query.get('departmentId')
  const status = query.get('status')

  return items.filter((item) => {
    const text = `${item.name} ${item.email} ${item.position}`.toLocaleLowerCase('ru')

    return (
      (!needle || text.includes(needle)) &&
      (!departmentId || item.departmentId === departmentId) &&
      (!status || item.status === status)
    )
  })
}

export function saveEmployee(state: MockState, employee: Employee, patch: EmployeePatch): Employee {
  const updated: Employee = {
    ...employee,
    name: patch.name.trim(),
    position: patch.position.trim(),
    status: patch.status
  }
  state.data.employeesById[updated.id] = updated

  for (const vacation of state.data.vacations.values()) {
    if (vacation.employeeId === updated.id) {
      vacation.employeeName = updated.name
    }
  }
  for (const account of Object.values(state.data.accountsByEmail)) {
    if (account.actor.employeeId === updated.id) {
      account.actor.name = updated.name
    }
  }

  return updated
}
