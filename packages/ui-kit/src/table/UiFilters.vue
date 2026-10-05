<script setup lang="ts">
import UiButton from '../UiButton.vue'
import UiInput from '../UiInput.vue'
import UiSelect from '../select/UiSelect.vue'
import type { TableFilter } from './types'

withDefaults(
  defineProps<{
    label: string
    compact?: boolean
    fields?: readonly TableFilter[]
    values?: Readonly<Record<string, string>>
    resetLabel?: string
  }>(),
  { fields: () => [], values: () => ({}), resetLabel: '' }
)
const emit = defineEmits<{ change: [key: string, value: string]; reset: [] }>()
</script>

<template>
  <div
    class="ui-filters"
    :class="{ 'ui-filters--compact': compact }"
    role="group"
    :aria-label="label"
  >
    <div
      v-if="$slots.search"
      class="ui-filters__search"
    >
      <slot name="search" />
    </div>
    <slot>
      <template
        v-for="field in fields"
        :key="field.key"
      >
        <div
          v-if="field.type === 'text'"
          class="ui-filters__search"
        >
          <UiInput
            :model-value="values[field.key] ?? ''"
            :label="field.label"
            :placeholder="field.placeholder"
            @update:model-value="emit('change', field.key, $event)"
          />
        </div>
        <UiSelect
          v-else
          :model-value="values[field.key] ?? ''"
          :label="field.label"
          :options="field.options"
          @update:model-value="emit('change', field.key, $event)"
        />
      </template>
    </slot>
    <div
      v-if="$slots.actions || resetLabel"
      class="ui-filters__actions"
    >
      <slot name="actions">
        <UiButton
          variant="ghost"
          @click="emit('reset')"
        >
          {{ resetLabel }}
        </UiButton>
      </slot>
    </div>
    <div
      v-if="$slots.summary"
      class="ui-filters__summary"
    >
      <slot name="summary" />
    </div>
  </div>
</template>
