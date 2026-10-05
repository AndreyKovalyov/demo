import type { Actor } from '@sigma/domain'
import { ApiPath, http } from '@/shared/api'

export const authApi = {
  login(email: string, password: string, signal?: AbortSignal) {
    return http.request<Actor>(ApiPath.Login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      ...(signal ? { signal } : {})
    })
  },

  current(signal?: AbortSignal) {
    return http.request<Actor>(ApiPath.CurrentUser, signal ? { signal } : {})
  },

  async logout() {
    await http.request(ApiPath.Logout, { method: 'POST' })
  }
}
