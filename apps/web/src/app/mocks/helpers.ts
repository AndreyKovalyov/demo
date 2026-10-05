import { delay, HttpResponse } from 'msw'
import type { HttpResponseResolver } from 'msw'
import { DomainError } from '@sigma/domain'
import type { Page } from '@sigma/domain'
import { ApiError } from '@/shared/api'
import type { MockState } from './state'

const RESPONSE_DELAY_MS = 450
const DOMAIN_ERROR_STATUS = { FORBIDDEN: 403, CONFLICT: 409, INVALID_INPUT: 400 }

export function mockHandler(resolve: HttpResponseResolver): HttpResponseResolver {
  return async (info) => {
    await delay(RESPONSE_DELAY_MS)
    if (info.request.signal.aborted) {
      return HttpResponse.error()
    }

    try {
      return await resolve(info)
    } catch (error) {
      if (error instanceof DomainError) {
        return HttpResponse.json(
          { code: error.code, message: error.message },
          {
            status: DOMAIN_ERROR_STATUS[error.code]
          }
        )
      }

      if (error instanceof ApiError) {
        return HttpResponse.json(
          { code: error.code, message: error.message },
          { status: error.status }
        )
      }

      return HttpResponse.json(
        { code: 'INTERNAL_ERROR', message: 'Не удалось выполнить запрос' },
        { status: 500 }
      )
    }
  }
}

export function requireActor(state: MockState) {
  if (!state.actor) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Войдите в аккаунт')
  }

  return state.actor
}

export function pageOf<T>(items: T[], url: URL): Page<T> {
  const page = Math.max(1, Math.floor(Number(url.searchParams.get('page')) || 1))
  const pageSize = Math.min(
    50,
    Math.max(1, Math.floor(Number(url.searchParams.get('pageSize')) || 8))
  )

  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize
  }
}
