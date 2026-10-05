import type { Action, Resource } from '@sigma/domain'
import type { RouteRecordRaw } from 'vue-router'
import { RouteName, RoutePath } from '@/shared/routes'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    action?: Action
    resource?: Resource
  }
}

export const routes: RouteRecordRaw[] = [
  { path: RoutePath.Home, redirect: RoutePath.Employees },
  {
    path: RoutePath.Login,
    name: RouteName.Login,
    component: () => import('@/pages/login'),
    meta: { public: true }
  },
  {
    path: RoutePath.Employees,
    name: RouteName.Employees,
    component: () => import('@/pages/employees'),
    meta: { action: 'read', resource: 'Employee' }
  },
  {
    path: RoutePath.Employee,
    name: RouteName.Employee,
    component: () => import('@/pages/employee'),
    meta: { action: 'read', resource: 'Employee' }
  },
  {
    path: RoutePath.EmployeeEdit,
    name: RouteName.EmployeeEdit,
    component: () => import('@/pages/employee-edit'),
    meta: { action: 'update', resource: 'Employee' }
  },
  {
    path: RoutePath.Departments,
    name: RouteName.Departments,
    component: () => import('@/pages/departments'),
    meta: { action: 'list', resource: 'Department' }
  },
  {
    path: RoutePath.Vacations,
    name: RouteName.Vacations,
    component: () => import('@/pages/vacations'),
    meta: { action: 'read', resource: 'VacationRequest' }
  },
  { path: RoutePath.UiKit, name: RouteName.UiKit, component: () => import('@/pages/ui-kit') },
  {
    path: RoutePath.Forbidden,
    name: RouteName.Forbidden,
    component: () => import('@/pages/status')
  },
  {
    path: RoutePath.Fallback,
    name: RouteName.NotFound,
    component: () => import('@/pages/status')
  }
]
