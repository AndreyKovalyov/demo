<script setup lang="ts">
withDefaults(defineProps<{ direction?: 'down' | 'left' | 'right' }>(), { direction: 'down' })
</script>

<template>
  <svg
    class="ui-chevron"
    :class="`ui-chevron--${direction}`"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
</template>
