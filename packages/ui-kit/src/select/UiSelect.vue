<script setup lang="ts" generic="T extends string">
import { computed, nextTick, ref, useId, watch } from 'vue'
import UiChevron from '../UiChevron.vue'
import UiField from '../UiField.vue'
import UiPopover from '../popover/UiPopover.vue'
import { useSelect } from './use-select'
import type { SelectOption } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    name?: string
    options: readonly SelectOption<T>[]
  }>(),
  { label: '', error: '', placeholder: '', disabled: false, required: false, name: '' }
)

const model = defineModel<T>({ required: true })
const id = useId()
const emit = defineEmits<{ blur: [event: FocusEvent] }>()
const trigger = ref<HTMLButtonElement | null>(null)
const opened = ref(false)
const optionButtons = ref<HTMLButtonElement[]>([])
const selected = computed(() => props.options.find((option) => option.value === model.value))
const { activeIndex, select, onKeydown } = useSelect(
  () => props.options,
  model,
  opened,
  () => trigger.value?.focus()
)

async function scrollActive() {
  await nextTick()
  optionButtons.value[activeIndex.value]?.scrollIntoView({ block: 'nearest' })
}

watch(activeIndex, scrollActive)
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
      :value="model"
      :disabled="disabled"
    />
    <button
      :id="id"
      ref="trigger"
      type="button"
      class="ui-input ui-select__control"
      :class="{ 'ui-select__control--empty': !selected }"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="opened"
      :aria-controls="`${id}-options`"
      :aria-labelledby="label ? `${id}-label` : undefined"
      :aria-activedescendant="
        opened && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
      "
      :aria-invalid="!!error"
      :aria-required="required"
      :aria-describedby="error ? `${id}-error` : undefined"
      :disabled="disabled"
      v-bind="$attrs"
      @click="opened = !opened"
      @keydown="onKeydown"
    >
      <span class="ui-select__value">{{ selected?.label ?? placeholder }}</span>
      <UiChevron class="ui-select__arrow" />
    </button>
    <UiPopover
      :id="`${id}-options`"
      v-model:open="opened"
      class="ui-select__options"
      :anchor="trigger"
      role="listbox"
      :aria-labelledby="label ? `${id}-label` : id"
      @opened="scrollActive"
    >
      <button
        v-for="(option, index) in options"
        :id="`${id}-option-${index}`"
        :key="option.value"
        ref="optionButtons"
        type="button"
        class="ui-select__option"
        :class="{ 'ui-select__option--active': index === activeIndex }"
        role="option"
        tabindex="-1"
        :aria-selected="option.value === model"
        :disabled="option.disabled"
        @click="select(index)"
      >
        {{ option.label }}
      </button>
    </UiPopover>
  </UiField>
</template>
