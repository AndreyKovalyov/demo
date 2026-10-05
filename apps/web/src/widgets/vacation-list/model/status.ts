import type { VacationStatus } from '@/entities/vacation'

export const STATUS_TONES = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
} as const satisfies Record<VacationStatus, string>
