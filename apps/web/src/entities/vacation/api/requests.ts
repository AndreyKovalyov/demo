import type {
  VacationDraft,
  VacationId,
  VacationQuery,
  VacationRequest,
  VacationStatus,
  Page
} from '@sigma/domain'
import { ApiPath, http } from '@/shared/api'

export const vacationsApi = {
  list(query: VacationQuery, signal?: AbortSignal) {
    const params = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [key, String(value)])
    )

    return http.request<Page<VacationRequest>>(
      `${ApiPath.Vacations}?${params}`,
      signal ? { signal } : {}
    )
  },

  create(draft: VacationDraft, signal?: AbortSignal) {
    return http.request<VacationRequest>(ApiPath.Vacations, {
      method: 'POST',
      body: JSON.stringify(draft),
      ...(signal ? { signal } : {})
    })
  },

  review(id: VacationId, status: Exclude<VacationStatus, 'pending'>, signal?: AbortSignal) {
    return http.request<VacationRequest>(`${ApiPath.Vacations}/${encodeURIComponent(id)}/review`, {
      method: 'POST',
      body: JSON.stringify({ status }),
      ...(signal ? { signal } : {})
    })
  }
}
