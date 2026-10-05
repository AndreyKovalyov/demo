<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '../UiButton.vue'

const props = defineProps<{
  total: number
  pageSize: number
  previousLabel: string
  nextLabel: string
  label: string
  disabled?: boolean
}>()
const page = defineModel<number>({ required: true })
const count = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<template>
  <nav
    class="ui-pagination"
    :aria-label="label"
  >
    <UiButton
      variant="secondary"
      :disabled="disabled || page <= 1"
      @click="page--"
    >
      {{ previousLabel }}
    </UiButton>
    <span class="ui-pagination__number">{{ page }} / {{ count }}</span>
    <UiButton
      variant="secondary"
      :disabled="disabled || page >= count"
      @click="page++"
    >
      {{ nextLabel }}
    </UiButton>
  </nav>
</template>
