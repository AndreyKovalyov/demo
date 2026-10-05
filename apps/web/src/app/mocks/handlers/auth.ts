import { http, HttpResponse } from 'msw'
import { ApiError, ApiPath } from '@/shared/api'
import { mockHandler, requireActor } from '../helpers'
import { saveSession } from '../state'
import type { MockState } from '../state'

export function createAuthHandlers(state: MockState) {
  return [
    http.post(
      `/api${ApiPath.Login}`,
      mockHandler(async ({ request }) => {
        const input = (await request.json()) as { email: string; password: string }
        const account = state.data.accountsByEmail[input.email]
        if (!account || account.password !== input.password) {
          throw new ApiError(401, 'UNAUTHORIZED', 'Неверный email или пароль')
        }

        state.actor = account.actor
        saveSession(account.email)

        return HttpResponse.json(state.actor)
      })
    ),

    http.get(
      `/api${ApiPath.CurrentUser}`,
      mockHandler(() => {
        return HttpResponse.json(requireActor(state))
      })
    ),

    http.post(
      `/api${ApiPath.Logout}`,
      mockHandler(() => {
        requireActor(state)
        state.actor = null
        saveSession(null)

        return HttpResponse.json({ ok: true })
      })
    )
  ]
}
