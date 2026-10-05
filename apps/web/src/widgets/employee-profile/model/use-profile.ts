import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { employeeId, useEmployeesStore } from '@/entities/employee'
import type { EmployeeId } from '@/entities/employee'
import { useDepartmentsStore } from '@/entities/department'
import { errorMessage, isAborted } from '@/shared/api'
import { latestRequest } from '@/shared/lib/latest-request'
import { loadProfileData } from './profile-data'

export function useProfile(id: Ref<string>) {
  const employees = useEmployeesStore()
  const departments = useDepartmentsStore()
  const request = latestRequest()

  const teamIds = ref<EmployeeId[]>([])
  const pending = ref(false)
  const error = ref('')

  const employee = computed(() => employees.byId[id.value])
  const team = computed(() => employees.select(teamIds.value))

  async function load() {
    const run = request.start()
    pending.value = true
    error.value = ''
    teamIds.value = []

    try {
      const [profile] = await Promise.all([
        loadProfileData(employeeId(id.value), run.signal),
        departments.items.length ? Promise.resolve() : departments.load(run.signal)
      ])
      if (!run.isCurrent()) {
        return
      }

      employees.upsert([profile.employee, ...profile.related, ...profile.team])
      teamIds.value = profile.team.map((person) => person.id)
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

  watch(id, load, { immediate: true })

  onBeforeUnmount(() => request.cancel())

  return { employee, employees, departments, team, pending, error, load }
}
