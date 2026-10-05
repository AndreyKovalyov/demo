import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { SelectOption } from './types'

export function useSelect<T extends string>(
  options: () => readonly SelectOption<T>[],
  model: Ref<T>,
  opened: Ref<boolean>,
  onSelect: () => void
) {
  const activeIndex = ref(-1)
  const enabledIndices = computed(() =>
    options().flatMap((option, index) => (option.disabled ? [] : [index]))
  )

  watch(
    opened,
    (value) => {
      if (!value) {
        return
      }

      const selected = options().findIndex((option) => option.value === model.value)
      activeIndex.value = enabledIndices.value.includes(selected)
        ? selected
        : (enabledIndices.value[0] ?? -1)
    },
    { flush: 'sync' }
  )

  function select(index: number) {
    const option = options()[index]

    if (!option || option.disabled) {
      return
    }

    model.value = option.value
    opened.value = false
    onSelect()
  }

  function move(offset: number) {
    if (!opened.value) {
      opened.value = true

      return
    }

    const current = enabledIndices.value.indexOf(activeIndex.value)
    const next = (current + offset + enabledIndices.value.length) % enabledIndices.value.length
    activeIndex.value = enabledIndices.value[next] ?? -1
  }

  function confirm() {
    if (!opened.value) {
      opened.value = true

      return
    }

    select(activeIndex.value)
  }

  const keys: Record<string, () => void> = {
    ArrowDown: () => move(1),
    ArrowUp: () => move(-1),
    Home: () => {
      opened.value = true
      activeIndex.value = enabledIndices.value[0] ?? -1
    },
    End: () => {
      opened.value = true
      activeIndex.value = enabledIndices.value.at(-1) ?? -1
    },
    Enter: confirm,
    ' ': confirm,
    Escape: () => {
      opened.value = false
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      opened.value = false

      return
    }

    const action = keys[event.key]

    if (action) {
      event.preventDefault()
      action()

      return
    }

    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    const index = options().findIndex(
      (option) =>
        !option.disabled &&
        option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase())
    )

    if (index >= 0) {
      event.preventDefault()
      opened.value = true
      activeIndex.value = index
    }
  }

  return { activeIndex, select, onKeydown }
}
