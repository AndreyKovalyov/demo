import { http, HttpResponse } from 'msw'
import { assertReview, DomainError, vacationId, unixMs, validateVacation } from '@sigma/domain'
import type { VacationDraft, VacationRequest, VacationStatus } from '@sigma/domain'
import { canAccess, defineAbility } from '@sigma/domain/access'
import { ApiError, ApiPath } from '@/shared/api'
import dayjs from '@/shared/lib/dayjs'
import { mockHandler, pageOf, requireActor } from '../helpers'
import type { MockState } from '../state'
import { sortVacations } from '../vacation-sorting'

function assertNoOverlap(state: MockState, employeeId: string, draft: VacationDraft) {
  const overlaps = [...state.data.vacations.values()].some(
    (item) =>
      item.employeeId === employeeId &&
      item.status !== 'rejected' &&
      draft.startDate <= item.endDate &&
      draft.endDate >= item.startDate
  )
  if (overlaps) {
    throw new DomainError('CONFLICT', 'Даты пересекаются с существующей заявкой')
  }
}

export function createVacationHandlers(state: MockState) {
  return [
    http.get(
      `/api${ApiPath.Vacations}`,
      mockHandler(({ request }) => {
        const ability = defineAbility(requireActor(state))
        const url = new URL(request.url)
        const status = url.searchParams.get('status')
        const items = [...state.data.vacations.values()].filter(
          (item) =>
            canAccess(ability, 'read', 'VacationRequest', item) &&
            (!status || item.status === status)
        )

        return HttpResponse.json(pageOf(sortVacations(items, url.searchParams), url))
      })
    ),

    http.post(
      `/api${ApiPath.Vacations}`,
      mockHandler(async ({ request }) => {
        const actor = requireActor(state)
        const draft = (await request.json()) as VacationDraft
        validateVacation(draft)
        assertNoOverlap(state, actor.employeeId, draft)

        const item: VacationRequest = {
          ...draft,
          reason: draft.reason.trim(),
          id: vacationId(crypto.randomUUID()),
          employeeId: actor.employeeId,
          employeeName: actor.name,
          departmentId: actor.departmentId,
          status: 'pending',
          createdAt: unixMs(dayjs().valueOf()),
          reviewedBy: null
        }
        state.data.vacations.set(item.id, item)

        return HttpResponse.json(item, { status: 201 })
      })
    ),

    http.post(
      `/api${ApiPath.Vacations}/:id/review`,
      mockHandler(async ({ request, params }) => {
        const actor = requireActor(state)
        const ability = defineAbility(actor)
        const item = state.data.vacations.get(String(params.id))
        if (!item) {
          throw new ApiError(404, 'NOT_FOUND', 'Заявка не найдена')
        }

        if (!canAccess(ability, 'review', 'VacationRequest', item)) {
          throw new DomainError('FORBIDDEN', 'Недостаточно прав для согласования')
        }

        assertReview(item)

        const { status } = (await request.json()) as { status: Exclude<VacationStatus, 'pending'> }
        const updated = { ...item, status, reviewedBy: actor.employeeId }
        state.data.vacations.set(item.id, updated)

        return HttpResponse.json(updated)
      })
    )
  ]
}
