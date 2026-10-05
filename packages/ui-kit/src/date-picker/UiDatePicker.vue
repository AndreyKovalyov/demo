<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import UiPopover from '../popover/UiPopover.vue'
import UiField from '../UiField.vue'
import UiCalendar from './UiCalendar.vue'
import { formatDate } from './date'
import { CALENDAR_LABELS } from './labels'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    min?: number | null
    max?: number | null
    locale?: string
    disabled?: boolean
    required?: boolean
    name?: string
  }>(),
  {
    label: '',
    error: '',
    min: null,
    max: null,
    locale: 'ru',
    disabled: false,
    required: false,
    name: ''
  }
)

const model = defineModel<number | null>({ default: null })
const id = useId()
const emit = defineEmits<{ blur: [event: FocusEvent] }>()
const opened = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const calendar = ref<InstanceType<typeof UiCalendar> | null>(null)
const placeholder = computed(() => CALENDAR_LABELS[props.locale === 'en' ? 'en' : 'ru'].placeholder)

function close() {
  opened.value = false
  trigger.value?.focus()
}
</script>

<template>
  <UiField
    :id="id"
    :label="label"
    :error="error"
    @blur="emit('blur', $event)"
  >
    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="model ?? ''"
      :disabled="disabled"
    />
    <button
      :id="id"
      ref="trigger"
      type="button"
      class="ui-input ui-date-picker__control"
      :class="{ 'ui-date-picker__control--empty': model === null }"
      aria-haspopup="dialog"
      :aria-expanded="opened"
      :aria-controls="`${id}-calendar`"
      :aria-labelledby="label ? `${id}-label` : undefined"
      :aria-invalid="!!error"
      :aria-required="required"
      :aria-describedby="error ? `${id}-error` : undefined"
      :disabled="disabled"
      v-bind="$attrs"
      @click="opened = !opened"
      @keydown.down.prevent="opened = true"
    >
      <span>{{ formatDate(model) || placeholder }}</span>
      <svg
        class="ui-date-picker__icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
        />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    </button>
    <UiPopover
      :id="`${id}-calendar`"
      v-model:open="opened"
      class="ui-date-picker__popup"
      :anchor="trigger"
      :match-width="false"
      role="dialog"
      :aria-labelledby="label ? `${id}-label` : id"
      @opened="calendar?.focus()"
    >
      <UiCalendar
        v-if="opened"
        ref="calendar"
        v-model="model"
        :min="min"
        :max="max"
        :locale="locale"
        @select="close"
      />
    </UiPopover>
  </UiField>
</template>
