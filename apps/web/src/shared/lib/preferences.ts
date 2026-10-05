import { computed, ref } from 'vue'
import { TIME_ZONE_OPTIONS } from '../config/preferences'

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Хранилище недоступно.
  }
}

const theme = ref<'light' | 'dark'>(
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
)
const savedZone = read('sigma-timezone')
const timeZone = ref(
  savedZone && TIME_ZONE_OPTIONS.some((option) => option.value === savedZone)
    ? savedZone
    : 'Europe/Moscow'
)

if (savedZone !== timeZone.value) {
  write('sigma-timezone', timeZone.value)
}

export function usePreferences() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme.value
    write('sigma-theme', theme.value)
  }

  function setTimeZone(value: string) {
    timeZone.value = value
    write('sigma-timezone', value)
  }

  return {
    theme,
    timeZone,
    isDark: computed(() => theme.value === 'dark'),
    toggleTheme,
    setTimeZone
  }
}

export { read as readPreference, write as writePreference }
