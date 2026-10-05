import { onBeforeUnmount, ref, watch } from 'vue'
import { vacationsApi } from '@/entities/vacation'
import type { VacationRequest } from '@/entities/vacation'
import { errorMessage, isAborted } from '@/shared/api'
import { latestRequest } from '@/shared/lib/latest-request'

import { VACATION_PAGE_SIZE } from './filters-store'
import { useVacationFilters } from './use-vacation-filters'

export function useVacationList() {
  const items = ref<VacationRequest[]>([])
  const total = ref(0)
  const filters = useVacationFilters()
  const { page, status, sort, query } = filters
  const pending = ref(false)
  const error = ref('')
  const notice = ref('')
  const showForm = ref(false)
  const request = latestRequest()

  async function load() {
    const run = request.start()
    pending.value = true
    error.value = ''

    try {
      const result = await vacationsApi.list(query.value, run.signal)
      if (!run.isCurrent()) {
        return
      }

      const maxPage = Math.max(1, Math.ceil(result.total / VACATION_PAGE_SIZE))
      if (page.value > maxPage) {
        page.value = maxPage

        return
      }

      items.value = result.items
      total.value = result.total
    } catch (caught) {
      if (run.isCurrent() && !isAborted(caught)) {
        error.value = errorMessage(caught)
      }
    } finally {
      if (run.isCurrent()) {
        pending.value = false
      }
    }
  }

  function created() {
    showForm.value = false
    notice.value = 'vacationCreated'
    const previousQuery = query.value
    filters.reset()

    if (query.value === previousQuery) {
      void load()
    }
  }

  function reviewed(updated: VacationRequest) {
    items.value = items.value.map((item) => (item.id === updated.id ? updated : item))
    notice.value = 'reviewed'
    void load()
  }

  function changeFilter(key: string, value: string) {
    notice.value = ''
    filters.changeFilter(key, value)
  }

  watch(query, load, { immediate: true })

  onBeforeUnmount(() => request.cancel())

  return {
    items,
    total,
    page,
    pageSize: VACATION_PAGE_SIZE,
    status,
    sort,
    setStatus: filters.setStatus,
    changeFilter,
    pending,
    error,
    notice,
    showForm,
    load,
    created,
    reviewed
  }
}
