<script setup lang="ts">
import { computed, ref } from 'vue'
import UiChevron from '../UiChevron.vue'
import { CALENDAR_LABELS } from './labels'
import { isDateDisabled, todayDate } from './date'
import { useCalendar } from './use-calendar'

const props = defineProps<{ min: number | null; max: number | null; locale: string }>()
const model = defineModel<number | null>({ required: true })
const emit = defineEmits<{ select: [] }>()
const grid = ref<HTMLElement | null>(null)
const labels = computed(() => CALENDAR_LABELS[props.locale === 'en' ? 'en' : 'ru'])
const today = todayDate()
const todayDisabled = computed(() => isDateDisabled(today, props.min, props.max))
const { focusedDate, title, days, previousAvailable, nextAvailable, changeMonth, onKeydown } =
  useCalendar(model, props, focusDate)
const weeks = computed(() =>
  Array.from({ length: 6 }, (_, index) => days.value.slice(index * 7, index * 7 + 7))
)

function focusDate(value: number) {
  grid.value?.querySelector<HTMLButtonElement>(`[data-date="${value}"]`)?.focus()
}

function select(value: number | null) {
  model.value = value
  emit('select')
}

defineExpose({ focus: () => focusDate(focusedDate.value) })
</script>

<template>
  <div class="ui-calendar">
    <header class="ui-calendar__header">
      <button
        type="button"
        class="ui-calendar__navigation"
        :aria-label="labels.previous"
        :disabled="!previousAvailable"
        @click="changeMonth(-1)"
      >
        <UiChevron direction="left" />
      </button>
      <span
        class="ui-calendar__title"
        aria-live="polite"
      >
        {{ title }}
      </span>
      <button
        type="button"
        class="ui-calendar__navigation"
        :aria-label="labels.next"
        :disabled="!nextAvailable"
        @click="changeMonth(1)"
      >
        <UiChevron direction="right" />
      </button>
    </header>
    <div
      ref="grid"
      role="grid"
      :aria-label="title"
      @keydown="onKeydown"
    >
      <div
        class="ui-calendar__week"
        role="row"
      >
        <span
          v-for="day in labels.weekdays"
          :key="day"
          class="ui-calendar__weekday"
          role="columnheader"
        >
          {{ day }}
        </span>
      </div>
      <div
        v-for="(week, index) in weeks"
        :key="index"
        class="ui-calendar__week"
        role="row"
      >
        <button
          v-for="day in week"
          :key="day.value"
          type="button"
          class="ui-calendar__day"
          :class="{ 'ui-calendar__day--outside': day.outsideMonth }"
          role="gridcell"
          :data-date="day.value"
          :aria-label="day.label"
          :aria-selected="day.value === model"
          :aria-current="day.today ? 'date' : undefined"
          :tabindex="day.value === focusedDate ? 0 : -1"
          :disabled="day.disabled"
          @click="select(day.value)"
        >
          {{ day.number }}
        </button>
      </div>
    </div>
    <footer class="ui-calendar__footer">
      <button
        type="button"
        class="ui-calendar__action"
        @click="select(null)"
      >
        {{ labels.clear }}
      </button>
      <button
        type="button"
        class="ui-calendar__action"
        :disabled="todayDisabled"
        @click="select(today)"
      >
        {{ labels.today }}
      </button>
    </footer>
  </div>
</template>
