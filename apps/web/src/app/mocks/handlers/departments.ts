import { http, HttpResponse } from 'msw'
import { canAccess, defineAbility } from '@sigma/domain/access'
import { ApiPath } from '@/shared/api'
import { mockHandler, requireActor } from '../helpers'
import type { MockState } from '../state'

export function createDepartmentHandlers(state: MockState) {
  return [
    http.get(
      `/api${ApiPath.Departments}`,
      mockHandler(() => {
        const ability = defineAbility(requireActor(state))
        const departments = state.data.departments.filter((department) =>
          canAccess(ability, 'read', 'Department', department)
        )

        return HttpResponse.json(departments)
      })
    )
  ]
}
