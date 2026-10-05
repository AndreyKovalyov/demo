import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EmployeeQuery } from '@/entities/employee'
import { readEmployeeQuery } from './query'

export const useEmployeeFiltersStore = defineStore('employeeFilters', () => {
  const query = ref<EmployeeQuery>(readEmployeeQuery({}))
  const search = ref('')

  function replaceQuery(next: EmployeeQuery) {
    if (JSON.stringify(query.value) === JSON.stringify(next)) {
      return
    }

    query.value = next
    search.value = next.search
  }

  function reset() {
    search.value = ''
    replaceQuery(readEmployeeQuery({}))
  }

  return { query, search, replaceQuery, reset }
})
