import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { Action, Actor, Department, Employee, VacationRequest, Resource } from './models'
import type { AppAbility } from './access/types'
import { applyCommonRules, applyManagerRules, applyRestrictions } from './access/rules'
import { toRecordSubject } from './access/subject'
import { Role } from './models'

export type { AppAbility } from './access/types'

export function defineAbility(actor: Actor | null): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility)
  if (!actor) {
    return builder.build()
  }

  applyCommonRules(builder, actor)

  if (actor.roles.includes(Role.Manager)) {
    applyManagerRules(builder, actor)
  }

  applyRestrictions(builder, actor)

  return builder.build()
}

export function canAccess(
  ability: AppAbility,
  action: Action,
  resource: Resource,
  record?: Employee | Department | VacationRequest
): boolean {
  if (!record) {
    return ability.can(action, resource)
  }

  const target = toRecordSubject(record)

  return target.__caslSubjectType__ === resource && ability.can(action, target)
}
