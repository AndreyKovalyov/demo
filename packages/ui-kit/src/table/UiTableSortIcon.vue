<script setup lang="ts">
defineProps<{ descending: boolean }>()
</script>

<template>
  <svg
    class="ui-table__sort-icon"
    :class="{ 'ui-table__sort-icon--descending': descending }"
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M8 13V3M4 7l4-4 4 4" />
  </svg>
</template>
