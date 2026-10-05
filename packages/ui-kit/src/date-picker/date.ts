import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ru'

dayjs.extend(utc)

export function todayDate(): number {
  return dayjs.utc(dayjs().format('YYYY-MM-DD')).valueOf()
}
export function formatDate(timestamp: number | null): string {
  if (timestamp === null) {
    return ''
  }

  return dayjs.utc(timestamp).format('DD.MM.YYYY')
}

export function boundedDate(value: number, min: number | null, max: number | null): number {
  const lower = min === null ? -Infinity : dayjs.utc(min).startOf('day').valueOf()
  const upper = max === null ? Infinity : dayjs.utc(max).startOf('day').valueOf()

  return Math.min(upper, Math.max(lower, dayjs.utc(value).startOf('day').valueOf()))
}

export function isDateDisabled(value: number, min: number | null, max: number | null): boolean {
  return boundedDate(value, min, max) !== value
}

export function monthAvailable(month: number, min: number | null, max: number | null): boolean {
  const start = dayjs.utc(month).startOf('month').valueOf()
  const end = dayjs.utc(month).endOf('month').startOf('day').valueOf()

  return (min === null || end >= min) && (max === null || start <= max)
}

export function calendarDays(
  month: number,
  min: number | null,
  max: number | null,
  locale: string
) {
  const first = dayjs.utc(month).startOf('month')
  const start = first.subtract((first.day() + 6) % 7, 'day')
  const today = todayDate()

  return Array.from({ length: 42 }, (_, index) => {
    const date = start.add(index, 'day')
    const value = date.valueOf()

    return {
      value,
      number: date.date(),
      label: date.locale(locale).format('D MMMM YYYY'),
      outsideMonth: date.month() !== first.month(),
      today: value === today,
      disabled: isDateDisabled(value, min, max)
    }
  })
}
