import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Department } from '@sigma/domain'
import { departmentsApi } from '../api/requests'

export const useDepartmentsStore = defineStore('departments', () => {
  const items = ref<Department[]>([])

  async function load(signal?: AbortSignal) {
    items.value = await departmentsApi.list(signal)
  }

  function clear() {
    items.value = []
  }

  function nameOf(id: string) {
    return items.value.find((item) => item.id === id)?.name ?? id
  }

  return { items, load, clear, nameOf }
})
