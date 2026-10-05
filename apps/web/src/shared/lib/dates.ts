import dayjs from './dayjs'
import { usePreferences } from './preferences'

export function formatInstant(value: number, locale: string, withTime = false): string {
  const { timeZone } = usePreferences()

  return dayjs(value)
    .tz(timeZone.value)
    .locale(locale)
    .format(withTime ? 'll HH:mm' : 'll')
}

/** День отпуска не сдвигается по часовому поясу. */
export function formatDateOnly(value: number, locale: string): string {
  return dayjs.utc(value).locale(locale).format('ll')
}
