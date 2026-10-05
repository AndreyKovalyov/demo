import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import dayjs from 'dayjs'
import { boundedDate, calendarDays, monthAvailable, todayDate } from './date'

interface CalendarOptions {
  min: number | null
  max: number | null
  locale: string
}

export function useCalendar(
  model: Ref<number | null>,
  options: CalendarOptions,
  focus: (date: number) => void
) {
  const focusedDate = ref(boundedDate(model.value ?? todayDate(), options.min, options.max))
  const month = computed(() => dayjs.utc(focusedDate.value).startOf('month'))
  const title = computed(() => month.value.locale(options.locale).format('MMMM YYYY'))
  const days = computed(() =>
    calendarDays(month.value.valueOf(), options.min, options.max, options.locale)
  )
  const previousAvailable = computed(() =>
    monthAvailable(month.value.subtract(1, 'month').valueOf(), options.min, options.max)
  )
  const nextAvailable = computed(() =>
    monthAvailable(month.value.add(1, 'month').valueOf(), options.min, options.max)
  )

  function changeMonth(offset: number) {
    focusedDate.value = boundedDate(
      dayjs.utc(focusedDate.value).add(offset, 'month').valueOf(),
      options.min,
      options.max
    )
  }

  function moveDays(offset: number) {
    focusedDate.value = boundedDate(
      dayjs.utc(focusedDate.value).add(offset, 'day').valueOf(),
      options.min,
      options.max
    )
  }

  const keys: Record<string, () => void> = {
    ArrowLeft: () => moveDays(-1),
    ArrowRight: () => moveDays(1),
    ArrowUp: () => moveDays(-7),
    ArrowDown: () => moveDays(7),
    Home: () => moveDays(-((dayjs.utc(focusedDate.value).day() + 6) % 7)),
    End: () => moveDays(6 - ((dayjs.utc(focusedDate.value).day() + 6) % 7)),
    PageUp: () => changeMonth(-1),
    PageDown: () => changeMonth(1)
  }

  async function onKeydown(event: KeyboardEvent) {
    const action = keys[event.key]

    if (!action) {
      return
    }

    event.preventDefault()
    action()
    await nextTick()
    focus(focusedDate.value)
  }

  return { focusedDate, title, days, previousAvailable, nextAvailable, changeMonth, onKeydown }
}
