<script setup lang="ts">
import { useId } from 'vue'
import UiField from './UiField.vue'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ label?: string; error?: string; type?: string }>(), {
  type: 'text',
  label: '',
  error: ''
})
const model = defineModel<string>({ default: '' })
const id = useId()
const emit = defineEmits<{ blur: [event: FocusEvent] }>()
</script>

<template>
  <UiField
    :id="id"
    :label="label"
    :error="error"
    @blur="emit('blur', $event)"
  >
    <input
      :id="id"
      v-model="model"
      class="ui-input"
      :type="type"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      v-bind="$attrs"
    />
  </UiField>
</template>
