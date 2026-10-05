import type { Actor } from '@sigma/domain'
import { createData } from './data'

const SESSION_KEY = 'sigma-account'

export interface MockState {
  data: ReturnType<typeof createData>
  actor: Actor | null
}

export function createMockState(): MockState {
  const data = createData()
  let email: string | null = null

  try {
    email = sessionStorage.getItem(SESSION_KEY)
  } catch {
    // Хранилище недоступно.
  }

  const actor = email ? (data.accountsByEmail[email]?.actor ?? null) : null

  return { data, actor }
}

export function saveSession(email: string | null) {
  try {
    if (email) {
      sessionStorage.setItem(SESSION_KEY, email)
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  } catch {
    // Сессия остаётся в памяти.
  }
}
