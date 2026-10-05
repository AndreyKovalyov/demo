import { employeesApi } from '@/entities/employee'
import type { Employee, EmployeeId } from '@/entities/employee'

async function loadRelatedEmployees(employee: Employee, signal: AbortSignal) {
  const ids = [employee.managerId, employee.kind === 'manager' ? employee.deputyId : null].filter(
    (id): id is EmployeeId => id !== null
  )

  return Promise.all([...new Set(ids)].map((id) => employeesApi.find(id, signal)))
}

async function loadManagerTeam(employee: Employee, signal: AbortSignal): Promise<Employee[]> {
  if (employee.kind !== 'manager') {
    return []
  }

  const result = await employeesApi.list(
    {
      page: 1,
      pageSize: 50,
      search: '',
      departmentId: employee.departmentId,
      status: '',
      sort: 'name',
      direction: 'asc'
    },
    signal
  )

  return result.items.filter((person) => person.managerId === employee.id)
}

export async function loadProfileData(id: EmployeeId, signal: AbortSignal) {
  const employee = await employeesApi.find(id, signal)
  const [related, team] = await Promise.all([
    loadRelatedEmployees(employee, signal),
    loadManagerTeam(employee, signal)
  ])

  return { employee, related, team }
}
