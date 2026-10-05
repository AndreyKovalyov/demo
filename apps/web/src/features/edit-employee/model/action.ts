import { DomainError } from '@sigma/domain'
import { employeesApi } from '@/entities/employee'
import type { Employee, EmployeePatch } from '@/entities/employee'
import { useSessionStore } from '@/entities/session'

export async function updateEmployee(
  employee: Employee,
  patch: EmployeePatch,
  signal?: AbortSignal
) {
  const session = useSessionStore()
  if (!session.can('update', 'Employee', employee)) {
    throw new DomainError('FORBIDDEN', 'Недостаточно прав для редактирования')
  }

  const name = patch.name.trim()
  const position = patch.position.trim()
  if (name.length < 2 || position.length < 2) {
    throw new DomainError('INVALID_INPUT', 'Имя и должность: не менее 2 символов')
  }

  const updated = await employeesApi.update(employee.id, { ...patch, name, position }, signal)

  if (session.actor?.employeeId === updated.id) {
    session.actor = { ...session.actor, name: updated.name }
  }

  return updated
}
