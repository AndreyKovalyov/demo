import { computed, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { RouteName } from '@/shared/routes'
import { useEmployeeFiltersStore } from './filters-store'
import { mergeEmployeeQuery, readEmployeeQuery, writeEmployeeQuery, SEARCH_DELAY_MS } from './query'
import type { EmployeeQueryPatch } from './query'

export function useEmployeeFilters() {
  const route = useRoute()
  const router = useRouter()
  const filters = useEmployeeFiltersStore()
  const session = useSessionStore()
  const { query, search } = storeToRefs(filters)
  let searchTimer: ReturnType<typeof setTimeout> | undefined

  function readQuery(source: LocationQueryRaw) {
    const next = readEmployeeQuery(source)

    if (!session.can('list', 'Department')) {
      next.departmentId = ''
    }

    return next
  }

  const initialQuery = Object.keys(route.query).length
    ? route.query
    : writeEmployeeQuery(query.value)
  filters.replaceQuery(readQuery(initialQuery))
  void router.replace({ query: writeEmployeeQuery(query.value) })

  function setQuery(patch: EmployeeQueryPatch, resetPage = true) {
    const pendingSearch = search.value !== query.value.search
    clearTimeout(searchTimer)

    const next = mergeEmployeeQuery(
      writeEmployeeQuery(query.value),
      { search: search.value, ...patch },
      resetPage || pendingSearch
    )
    filters.replaceQuery(readQuery(next))
    void router.replace({ query: writeEmployeeQuery(query.value) })
  }

  function reset() {
    clearTimeout(searchTimer)
    filters.reset()
    void router.replace({ query: {} })
  }

  const filterValues = computed(() => ({
    search: search.value,
    department: query.value.departmentId,
    status: query.value.status
  }))
  const filterHandlers: Record<string, (value: string) => void> = {
    search: (value) => {
      search.value = value
    },
    department: (value) => setQuery({ department: value }),
    status: (value) => setQuery({ status: value })
  }

  function changeFilter(key: string, value: string) {
    filterHandlers[key]?.(value)
  }

  watch(
    () => route.query,
    (value) => {
      if (route.name === RouteName.Employees) {
        filters.replaceQuery(readQuery(value))
      }
    }
  )

  watch(
    search,
    (value) => {
      clearTimeout(searchTimer)

      if (value === query.value.search) {
        return
      }

      searchTimer = setTimeout(() => setQuery({ search: value }), SEARCH_DELAY_MS)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => clearTimeout(searchTimer))

  return { query, filterValues, changeFilter, setQuery, reset }
}
