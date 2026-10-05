import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { VacationSortKey, VacationStatus } from '@/entities/vacation'

export const VACATION_PAGE_SIZE = 6

export const useVacationFiltersStore = defineStore('vacationFilters', () => {
  const page = ref(1)
  const status = ref<VacationStatus | ''>('')
  const sortKey = ref<VacationSortKey>('createdAt')
  const direction = ref<'asc' | 'desc'>('desc')

  function setStatus(value: VacationStatus | '') {
    status.value = value
    page.value = 1
  }

  function reset() {
    setStatus('')
    sortKey.value = 'createdAt'
    direction.value = 'desc'
  }

  function setSort(key: VacationSortKey, order: 'asc' | 'desc') {
    sortKey.value = key
    direction.value = order
    page.value = 1
  }

  return { page, status, sortKey, direction, setStatus, setSort, reset }
})
