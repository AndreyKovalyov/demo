import { http, HttpResponse } from 'msw'
import { createMockState } from './state'
import { createAuthHandlers } from './handlers/auth'
import { createEmployeeHandlers } from './handlers/employees'
import { createDepartmentHandlers } from './handlers/departments'
import { createVacationHandlers } from './handlers/vacations'

export function createHandlers() {
  const state = createMockState()

  return [
    ...createAuthHandlers(state),
    ...createEmployeeHandlers(state),
    ...createDepartmentHandlers(state),
    ...createVacationHandlers(state),
    http.all('/api/*', () =>
      HttpResponse.json({ code: 'NOT_FOUND', message: 'Маршрут не найден' }, { status: 404 })
    )
  ]
}
