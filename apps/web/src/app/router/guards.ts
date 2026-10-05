import type { Action } from '@sigma/domain'
import type { NavigationGuard, RouteLocationNormalized, RouteRecordName } from 'vue-router'
import { employeeId, employeesApi } from '@/entities/employee'
import type { useSessionStore } from '@/entities/session'
import { ApiError } from '@/shared/api'
import { RouteName, RoutePath } from '@/shared/routes'

type SessionStore = ReturnType<typeof useSessionStore>

const employeeActions = new Map<RouteRecordName, Action>([
  [RouteName.Employee, 'read'],
  [RouteName.EmployeeEdit, 'update']
])

function checkAuthentication(to: RouteLocationNormalized, session: SessionStore) {
  if (!to.meta.public && !session.isAuthenticated) {
    return { name: RouteName.Login, query: { redirect: to.fullPath } }
  }

  if (to.name === RouteName.Login && session.isAuthenticated) {
    return RoutePath.Employees
  }
}

function checkPermission(to: RouteLocationNormalized, session: SessionStore) {
  const { action, resource } = to.meta

  if (action && resource && !session.can(action, resource)) {
    return RoutePath.Forbidden
  }
}

async function checkEmployee(to: RouteLocationNormalized, session: SessionStore) {
  const action = employeeActions.get(to.name ?? '')
  if (!action) {
    return
  }

  try {
    const employee = await employeesApi.find(employeeId(String(to.params.id)))

    if (!session.can(action, 'Employee', employee)) {
      return RoutePath.Forbidden
    }
  } catch (error) {
    return error instanceof ApiError && error.status === 403
      ? RoutePath.Forbidden
      : RoutePath.NotFound
  }
}

export function createRouteGuard(session: SessionStore): NavigationGuard {
  return async (to) =>
    checkAuthentication(to, session) ??
    checkPermission(to, session) ??
    (await checkEmployee(to, session))
}
