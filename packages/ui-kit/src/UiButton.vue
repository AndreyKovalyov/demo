<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', type: 'button' }
)
</script>

<template>
  <button
    :type="type"
    class="ui-button"
    :class="`ui-button--${variant}`"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span
      v-if="loading"
      class="ui-spinner"
      aria-hidden="true"
    ></span>
    <span
      class="ui-button__label"
      :class="{ 'ui-button__label--loading': loading }"
    >
      <slot />
    </span>
  </button>
</template>
