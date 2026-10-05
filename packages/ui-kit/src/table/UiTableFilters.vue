<script setup lang="ts">
import { ref, useId } from 'vue'
import UiChevron from '../UiChevron.vue'

defineProps<{ label: string }>()

const expanded = ref(false)
const id = useId()
</script>

<template>
  <div
    class="ui-table-filters"
    :class="{ 'ui-table-filters--open': expanded }"
  >
    <button
      type="button"
      class="ui-table-filters__toggle"
      :aria-expanded="expanded"
      :aria-controls="id"
      @click="expanded = !expanded"
    >
      {{ label }}
      <UiChevron />
    </button>
    <div
      :id="id"
      class="ui-table-filters__content"
    >
      <slot />
    </div>
    <div
      v-if="$slots.summary"
      class="ui-table-filters__summary"
    >
      <slot name="summary" />
    </div>
  </div>
</template>
