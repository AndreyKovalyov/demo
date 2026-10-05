import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useDepartmentsStore } from '@/entities/department'
import { employeesApi, useEmployeesStore } from '@/entities/employee'
import { errorMessage, isAborted } from '@/shared/api'
import { latestRequest } from '@/shared/lib/latest-request'

export function useDepartments() {
  const departments = useDepartmentsStore()
  const employees = useEmployeesStore()
  const request = latestRequest()

  const pending = ref(true)
  const error = ref('')

  async function loadManagers(signal: AbortSignal) {
    return Promise.all(
      departments.items.map((department) => employeesApi.find(department.managerId, signal))
    )
  }

  async function load() {
    const run = request.start()
    pending.value = true
    error.value = ''

    try {
      await departments.load(run.signal)
      const managers = await loadManagers(run.signal)
      if (run.isCurrent()) {
        employees.upsert(managers)
      }
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

  onMounted(load)

  onBeforeUnmount(() => request.cancel())

  return { departments, employees, pending, error, load }
}
