import { RoutePath } from '@/shared/routes'

export const NAVIGATION_ITEMS = [
  {
    path: RoutePath.Employees,
    label: 'employees',
    icon: 'people',
    action: 'read',
    resource: 'Employee'
  },
  {
    path: RoutePath.Departments,
    label: 'departments',
    icon: 'departments',
    action: 'list',
    resource: 'Department'
  },
  {
    path: RoutePath.Vacations,
    label: 'vacations',
    icon: 'calendar',
    action: 'read',
    resource: 'VacationRequest'
  },
  { path: RoutePath.UiKit, label: 'uiKit', icon: 'grid' }
] as const
