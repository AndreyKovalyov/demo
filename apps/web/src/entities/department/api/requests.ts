import type { Department } from '@sigma/domain'
import { ApiPath, http } from '@/shared/api'

export const departmentsApi = {
  list(signal?: AbortSignal) {
    return http.request<Department[]>(ApiPath.Departments, signal ? { signal } : {})
  }
}
