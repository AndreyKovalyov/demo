export type Brand<T, Name extends string> = T & { readonly __brand: Name }

export type EmployeeId = Brand<string, 'EmployeeId'>

export type DepartmentId = Brand<string, 'DepartmentId'>

export type VacationId = Brand<string, 'VacationId'>

export type UnixMs = Brand<number, 'UnixMs'>

export const employeeId = (value: string) => value as EmployeeId
export const departmentId = (value: string) => value as DepartmentId
export const vacationId = (value: string) => value as VacationId

export enum Role {
  Manager = 'manager',
  Employee = 'employee'
}

export interface Actor {
  employeeId: EmployeeId
  departmentId: DepartmentId
  name: string
  roles: readonly Role[]
}

export type EmployeeStatus = 'active' | 'on-vacation'

interface EmployeeBase {
  id: EmployeeId
  name: string
  email: string
  position: string
  departmentId: DepartmentId
  managerId: EmployeeId | null
  status: EmployeeStatus
  joinedAt: UnixMs
  /** Зарплата с учётом прав доступа. */
  salary?: number
}

export type Employee = EmployeeBase &
  ({ kind: 'employee' } | { kind: 'manager'; deputyId: EmployeeId | null })

export interface Department {
  id: DepartmentId
  name: string
  description: string
  managerId: EmployeeId
  memberCount: number
}

export type VacationStatus = 'pending' | 'approved' | 'rejected'

export interface VacationRequest {
  id: VacationId
  employeeId: EmployeeId
  departmentId: DepartmentId
  employeeName: string
  /** Начало дня в UTC. */
  startDate: UnixMs
  endDate: UnixMs
  reason: string
  status: VacationStatus
  createdAt: UnixMs
  reviewedBy: EmployeeId | null
}

export type Action = 'read' | 'list' | 'readSalary' | 'update' | 'create' | 'review'

export type Resource = 'Employee' | 'Department' | 'VacationRequest'

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface PageQuery {
  page: number
  pageSize: number
}

export interface EmployeeQuery extends PageQuery {
  search: string
  departmentId: DepartmentId | ''
  status: EmployeeStatus | ''
  sort: EmployeeSortKey
  direction: 'asc' | 'desc'
}

export const EMPLOYEE_SORT_KEYS = [
  'name',
  'departmentId',
  'position',
  'status',
  'joinedAt'
] as const

export type EmployeeSortKey = (typeof EMPLOYEE_SORT_KEYS)[number]

export interface VacationQuery extends PageQuery {
  status: VacationStatus | ''
  sort: VacationSortKey
  direction: 'asc' | 'desc'
}

export const VACATION_SORT_KEYS = [
  'employeeName',
  'startDate',
  'endDate',
  'createdAt',
  'reason',
  'status'
] as const

export type VacationSortKey = (typeof VACATION_SORT_KEYS)[number]

export type EmployeePatch = Pick<Employee, 'name' | 'position' | 'status'>

export interface VacationDraft {
  startDate: UnixMs
  endDate: UnixMs
  reason: string
}
