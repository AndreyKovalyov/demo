<script setup lang="ts">
defineProps<{ id: string; label: string; error: string }>()
const emit = defineEmits<{ blur: [event: FocusEvent] }>()

function onFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement

  if (field.contains(event.relatedTarget as Node | null)) {
    return
  }

  emit('blur', event)
}
</script>

<template>
  <div
    class="ui-field"
    @focusout="onFocusOut"
  >
    <label
      v-if="label"
      :id="`${id}-label`"
      :for="id"
    >
      {{ label }}
    </label>
    <slot />
    <span
      v-if="error"
      :id="`${id}-error`"
      class="ui-field__error"
      aria-live="polite"
    >
      {{ error }}
    </span>
  </div>
</template>
