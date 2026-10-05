import type { Employee, EmployeeId, EmployeePatch, EmployeeQuery, Page } from '@sigma/domain'
import { ApiPath, http } from '@/shared/api'

export const employeesApi = {
  list(query: EmployeeQuery, signal?: AbortSignal) {
    const params = new URLSearchParams(
      Object.entries(query).map(([key, value]) => [key, String(value)])
    )

    return http.request<Page<Employee>>(`${ApiPath.Employees}?${params}`, signal ? { signal } : {})
  },

  find(id: EmployeeId, signal?: AbortSignal) {
    return http.request<Employee>(
      `${ApiPath.Employees}/${encodeURIComponent(id)}`,
      signal ? { signal } : {}
    )
  },

  update(id: EmployeeId, patch: EmployeePatch, signal?: AbortSignal) {
    return http.request<Employee>(`${ApiPath.Employees}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
      ...(signal ? { signal } : {})
    })
  }
}
