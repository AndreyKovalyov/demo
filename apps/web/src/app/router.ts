import { createRouter, createWebHistory } from 'vue-router'
import type { useSessionStore } from '@/entities/session'
import { createRouteGuard } from './router/guards'
import { routes } from './router/routes'

export function createAppRouter(session: ReturnType<typeof useSessionStore>) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
  })

  router.beforeEach(createRouteGuard(session))

  return router
}
