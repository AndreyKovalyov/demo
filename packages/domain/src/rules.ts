import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { VacationDraft, VacationRequest, UnixMs } from './models'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

export const DAY_MS = 86_400_000
export const MAX_LEAVE_DAYS = 28

export class DomainError extends Error {
  constructor(
    public readonly code: 'FORBIDDEN' | 'INVALID_INPUT' | 'CONFLICT',
    message: string
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export function dateToTimestamp(value: string): UnixMs {
  const date = dayjs.utc(value, 'YYYY-MM-DD', true)

  if (!date.isValid()) {
    throw new DomainError('INVALID_INPUT', 'Некорректная дата')
  }

  return unixMs(date.valueOf())
}

export function vacationDays(draft: Pick<VacationDraft, 'startDate' | 'endDate'>): number {
  return dayjs.utc(draft.endDate).diff(dayjs.utc(draft.startDate), 'day') + 1
}

export function validateVacation(draft: VacationDraft): void {
  unixMs(draft.startDate)
  unixMs(draft.endDate)
  if (draft.startDate % DAY_MS !== 0 || draft.endDate % DAY_MS !== 0) {
    throw new DomainError('INVALID_INPUT', 'Дни отпуска должны начинаться в полночь UTC')
  }

  const days = vacationDays(draft)
  if (days < 1 || days > MAX_LEAVE_DAYS) {
    throw new DomainError('INVALID_INPUT', 'Отпуск должен длиться от 1 до 28 календарных дней')
  }

  if (draft.reason.trim().length < 3 || draft.reason.length > 240) {
    throw new DomainError('INVALID_INPUT', 'Комментарий: от 3 до 240 символов')
  }
}

export function assertReview(request: VacationRequest): void {
  if (request.status !== 'pending') {
    throw new DomainError('CONFLICT', 'Заявка уже рассмотрена')
  }
}

export function unixMs(value: number): UnixMs {
  if (!Number.isSafeInteger(value) || Math.abs(value) > 8_640_000_000_000_000) {
    throw new DomainError('INVALID_INPUT', 'Некорректный timestamp')
  }

  return value as UnixMs
}
