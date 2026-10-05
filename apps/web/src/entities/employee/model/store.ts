import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Employee, EmployeeId } from '@sigma/domain'
import { employeesApi } from '../api/requests'

export const useEmployeesStore = defineStore('employees', () => {
  const byId = ref<Record<string, Employee>>({})

  function upsert(items: readonly Employee[]) {
    for (const item of items) {
      byId.value[item.id] = item
    }
  }

  function select(ids: readonly EmployeeId[]) {
    return ids.flatMap((id) => (byId.value[id] ? [byId.value[id]!] : []))
  }

  async function loadOne(id: EmployeeId, signal?: AbortSignal) {
    const item = await employeesApi.find(id, signal)
    upsert([item])

    return item
  }

  function clear() {
    byId.value = {}
  }

  return { byId, upsert, select, loadOne, clear }
})
