<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; color?: string; large?: boolean }>(), {
  color: 'blue'
})
const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
)
</script>

<template>
  <span
    class="ui-avatar"
    :class="[{ 'ui-avatar--large': large }, `ui-avatar--${color}`]"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
