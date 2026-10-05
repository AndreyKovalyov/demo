import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { TableSort } from '@sigma/ui-kit'
import { VACATION_SORT_KEYS } from '@/entities/vacation'
import type { VacationStatus } from '@/entities/vacation'
import { useVacationFiltersStore, VACATION_PAGE_SIZE } from './filters-store'

export function useVacationFilters() {
  const store = useVacationFiltersStore()
  const { page, status, sortKey, direction } = storeToRefs(store)
  const query = computed(() => ({
    page: page.value,
    pageSize: VACATION_PAGE_SIZE,
    status: status.value,
    sort: sortKey.value,
    direction: direction.value
  }))
  const sort = computed<TableSort | null>({
    get: () => ({ key: sortKey.value, direction: direction.value }),
    set: (value) => {
      const key = VACATION_SORT_KEYS.find((item) => item === value?.key)

      if (key && value) {
        store.setSort(key, value.direction)
      }
    }
  })

  function changeFilter(key: string, value: string) {
    if (key === 'status') {
      store.setStatus(value as VacationStatus | '')
    }
  }

  return { page, status, sort, query, changeFilter, setStatus: store.setStatus, reset: store.reset }
}
