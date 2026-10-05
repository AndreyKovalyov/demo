import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { employeesApi, useEmployeesStore } from '@/entities/employee'
import type { EmployeeId } from '@/entities/employee'
import { useDepartmentsStore } from '@/entities/department'
import { errorMessage, isAborted } from '@/shared/api'
import { latestRequest } from '@/shared/lib/latest-request'
import { useEmployeeFilters } from './use-employee-filters'

export function useEmployeeList() {
  const employees = useEmployeesStore()
  const departments = useDepartmentsStore()
  const { query, filterValues, changeFilter, setQuery, reset } = useEmployeeFilters()
  const ids = ref<EmployeeId[]>([])
  const total = ref(0)
  const pending = ref(false)
  const error = ref('')
  const cancelled = ref(false)
  const request = latestRequest()

  async function load() {
    const run = request.start()
    pending.value = true
    error.value = ''
    cancelled.value = false

    try {
      const [result] = await Promise.all([
        employeesApi.list(query.value, run.signal),
        departments.items.length ? Promise.resolve() : departments.load(run.signal)
      ])
      if (!run.isCurrent()) {
        return
      }

      const maxPage = Math.max(1, Math.ceil(result.total / result.pageSize))
      if (query.value.page > maxPage) {
        setQuery({ page: maxPage }, false)

        return
      }

      employees.upsert(result.items)
      ids.value = result.items.map((item) => item.id)
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

  watch(
    query,
    () => {
      void load()
    },
    { immediate: true }
  )

  function cancel() {
    request.cancel()
    pending.value = false
    cancelled.value = true
  }

  onBeforeUnmount(() => request.cancel())

  const rows = computed(() => employees.select(ids.value))

  return {
    query,
    filterValues,
    changeFilter,
    rows,
    total,
    pending,
    error,
    cancelled,
    load,
    cancel,
    reset,
    setQuery,
    departments
  }
}
