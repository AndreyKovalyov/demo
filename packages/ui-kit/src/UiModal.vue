<script setup lang="ts">
import { onMounted, ref, useId, watch } from 'vue'

defineProps<{ title: string; closeLabel: string }>()
const open = defineModel<boolean>({ required: true })
const dialog = ref<HTMLDialogElement>()
const id = useId()

function sync() {
  if (open.value) {
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
  }
}

onMounted(sync)

watch(open, sync)
</script>

<template>
  <dialog
    ref="dialog"
    class="ui-modal"
    :aria-labelledby="id"
    @cancel.prevent="open = false"
    @close="open = false"
    @click="$event.target === $event.currentTarget && (open = false)"
  >
    <div class="ui-modal__body">
      <header class="ui-modal__header">
        <h2 :id="id">{{ title }}</h2>
        <button
          type="button"
          class="ui-modal__close"
          :aria-label="closeLabel"
          @click="open = false"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>
      <slot />
    </div>
  </dialog>
</template>
