import { http, HttpResponse } from 'msw'
import { DomainError } from '@sigma/domain'
import type { EmployeePatch } from '@sigma/domain'
import { canAccess, defineAbility } from '@sigma/domain/access'
import { ApiError, ApiPath } from '@/shared/api'
import { filterEmployees, saveEmployee, visibleEmployee } from '../employee-helpers'
import { sortEmployees } from '../employee-sorting'
import { mockHandler, pageOf, requireActor } from '../helpers'
import type { MockState } from '../state'

function findEmployee(state: MockState, id: string | readonly string[] | undefined) {
  const employee = state.data.employeesById[String(id)]
  if (!employee) {
    throw new ApiError(404, 'NOT_FOUND', 'Сотрудник не найден')
  }

  return employee
}

export function createEmployeeHandlers(state: MockState) {
  return [
    http.get(
      `/api${ApiPath.Employees}`,
      mockHandler(({ request }) => {
        const ability = defineAbility(requireActor(state))
        const url = new URL(request.url)
        const available = Object.values(state.data.employeesById).filter((employee) =>
          canAccess(ability, 'read', 'Employee', employee)
        )
        const filtered = filterEmployees(available, url.searchParams)
        const sorted = sortEmployees(filtered, url.searchParams, state.data.departments)
        const items = sorted.map((employee) => visibleEmployee(employee, ability))

        return HttpResponse.json(pageOf(items, url))
      })
    ),

    http.get(
      `/api${ApiPath.Employees}/:id`,
      mockHandler(({ params }) => {
        const ability = defineAbility(requireActor(state))
        const employee = findEmployee(state, params.id)

        if (!canAccess(ability, 'read', 'Employee', employee)) {
          throw new DomainError('FORBIDDEN', 'Доступны только сотрудники своего отдела')
        }

        return HttpResponse.json(visibleEmployee(employee, ability))
      })
    ),

    http.patch(
      `/api${ApiPath.Employees}/:id`,
      mockHandler(async ({ request, params }) => {
        const ability = defineAbility(requireActor(state))
        const employee = findEmployee(state, params.id)
        if (!canAccess(ability, 'update', 'Employee', employee)) {
          throw new DomainError('FORBIDDEN', 'Редактировать можно только сотрудников своего отдела')
        }

        const patch = (await request.json()) as EmployeePatch
        const updated = saveEmployee(state, employee, patch)

        return HttpResponse.json(visibleEmployee(updated, ability))
      })
    )
  ]
}
