import type { AbilityBuilder } from '@casl/ability'
import type { Actor } from '../models'
import type { AppAbility } from './types'

export function applyCommonRules({ can }: AbilityBuilder<AppAbility>, actor: Actor) {
  can('read', 'Employee', { departmentId: actor.departmentId })
  can('read', 'Department', { id: actor.departmentId })
  can('readSalary', 'Employee', { id: actor.employeeId })
  can('create', 'VacationRequest')
  can('read', 'VacationRequest', { employeeId: actor.employeeId })
}

export function applyManagerRules({ can }: AbilityBuilder<AppAbility>, actor: Actor) {
  const department = { departmentId: actor.departmentId }

  can('read', 'Employee')
  can('read', 'Department')
  can('list', 'Department')
  can('readSalary', 'Employee', department)
  can('update', 'Employee', department)
  can('read', 'VacationRequest', department)
  can('review', 'VacationRequest', { ...department, status: 'pending' })
}

export function applyRestrictions({ cannot }: AbilityBuilder<AppAbility>, actor: Actor) {
  // Запрет применяется после разрешений.
  cannot('review', 'VacationRequest', { employeeId: actor.employeeId })
}
