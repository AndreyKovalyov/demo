<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { usePopoverPosition } from './use-popover-position'

const props = withDefaults(defineProps<{ anchor: HTMLElement | null; matchWidth?: boolean }>(), {
  matchWidth: true
})
const opened = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ opened: [] }>()
const popup = ref<HTMLElement | null>(null)
const { style, update } = usePopoverPosition(
  () => props.anchor,
  popup,
  opened,
  () => props.matchWidth
)

watch(opened, async (value) => {
  await nextTick()

  if (!popup.value) {
    return
  }

  if (!value) {
    popup.value.hidePopover()

    return
  }

  popup.value.showPopover()
  update()
  await nextTick()
  emit('opened')
})

function sync(event: Event) {
  opened.value = (event as ToggleEvent).newState === 'open'
}

function close() {
  opened.value = false
  props.anchor?.focus()
}
</script>

<template>
  <div
    ref="popup"
    class="ui-popover"
    popover="auto"
    :style="style"
    @toggle="sync"
    @keydown.esc.prevent="close"
  >
    <slot />
  </div>
</template>
