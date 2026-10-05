import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import { useSessionStore } from '@/entities/session'
import { useEmployeesStore } from '@/entities/employee'
import { useDepartmentsStore } from '@/entities/department'
import { useEmployeeFiltersStore } from '@/widgets/employee-list'
import { useVacationFiltersStore } from '@/widgets/vacation-list'
import { http } from '@/shared/api'
import { RoutePath } from '@/shared/routes'
import { i18n } from '@/shared/i18n'
import { createAppRouter } from './router'
import App from './App.vue'
import '@sigma/ui-kit/styles.scss'
import './styles/index.scss'

async function bootstrap() {
  const { worker } = await import('./mocks/browser')
  // Моки включены и в сборке демо.
  await worker.start({ quiet: true, onUnhandledRequest: 'bypass' })

  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia).use(i18n)

  const session = useSessionStore(pinia)
  const employees = useEmployeesStore(pinia)
  const departments = useDepartmentsStore(pinia)
  const employeeFilters = useEmployeeFiltersStore(pinia)
  const vacationFilters = useVacationFiltersStore(pinia)
  const router = createAppRouter(session)

  http.onUnauthorized = () => {
    session.clear()
    void router.replace(RoutePath.Login)
  }

  watch(
    () => session.actor?.employeeId,
    () => {
      employees.clear()
      departments.clear()
      employeeFilters.reset()
      vacationFilters.reset()
    },
    { flush: 'sync' }
  )

  await session.restore()
  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap().catch((error) => {
  console.error(error)
  const root = document.getElementById('app')
  if (root) {
    root.textContent = 'Не удалось запустить демо. Обновите страницу или откройте его на localhost.'
  }
})
