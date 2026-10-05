import { unixMs } from '@sigma/domain'
import { vacationDays } from '@/entities/vacation'

export function vacationDaysFromDates(
  startDate: number | null,
  endDate: number | null
): number | null {
  if (startDate === null || endDate === null) {
    return null
  }

  try {
    return vacationDays({
      startDate: unixMs(startDate),
      endDate: unixMs(endDate)
    })
  } catch {
    return null
  }
}
