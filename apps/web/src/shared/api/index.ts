export enum ApiPath {
  Login = '/auth/login',
  CurrentUser = '/auth/me',
  Logout = '/auth/logout',
  Employees = '/employees',
  Departments = '/departments',
  Vacations = '/vacations'
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const http = {
  onUnauthorized: undefined as (() => void) | undefined,

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers)
    if (options.body) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(`/api${path}`, {
      ...options,
      credentials: 'same-origin',
      headers
    })

    if (!response.ok) {
      const error = (await response.json()) as { code: string; message: string }
      if (response.status === 401 && path !== ApiPath.Login && path !== ApiPath.CurrentUser) {
        http.onUnauthorized?.()
      }

      throw new ApiError(response.status, error.code, error.message)
    }

    return response.json() as Promise<T>
  }
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Не удалось выполнить запрос'

export const isAborted = (error: unknown) => error instanceof Error && error.name === 'AbortError'
