import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties, Ref } from 'vue'

export function usePopoverPosition(
  anchor: () => HTMLElement | null,
  popup: Ref<HTMLElement | null>,
  opened: Ref<boolean>,
  matchWidth: () => boolean
) {
  const style = ref<CSSProperties>({})

  function update() {
    const element = popup.value
    const target = anchor()

    if (!opened.value || !element || !target) {
      return
    }

    const bounds = target.getBoundingClientRect()
    const width = matchWidth() ? bounds.width : element.offsetWidth
    const height = element.offsetHeight
    const below = bounds.bottom + 6
    const top =
      below + height <= window.innerHeight - 8 ? below : Math.max(8, bounds.top - height - 6)
    const left = Math.max(8, Math.min(bounds.left, window.innerWidth - width - 8))

    style.value = {
      top: `${top}px`,
      left: `${left}px`,
      width: matchWidth() ? `${width}px` : '',
      maxHeight: `${window.innerHeight - top - 8}px`
    }
  }

  onMounted(() => {
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
    window.removeEventListener('scroll', update, true)
  })

  return { style, update }
}
