import { assertReview, DomainError, validateVacation } from '@sigma/domain'
import { vacationsApi } from '@/entities/vacation'
import type { VacationDraft, VacationRequest, VacationStatus } from '@/entities/vacation'
import { useSessionStore } from '@/entities/session'

export async function requestVacation(draft: VacationDraft, signal?: AbortSignal) {
  const session = useSessionStore()
  if (!session.can('create', 'VacationRequest')) {
    throw new DomainError('FORBIDDEN', 'Недостаточно прав')
  }

  validateVacation(draft)

  return vacationsApi.create({ ...draft, reason: draft.reason.trim() }, signal)
}

export async function reviewVacation(
  request: VacationRequest,
  status: Exclude<VacationStatus, 'pending'>,
  signal?: AbortSignal
) {
  const session = useSessionStore()
  if (!session.can('review', 'VacationRequest', request)) {
    throw new DomainError('FORBIDDEN', 'Недостаточно прав для согласования')
  }

  assertReview(request)

  return vacationsApi.review(request.id, status, signal)
}
