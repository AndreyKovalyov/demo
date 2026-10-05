import type { MongoAbility } from '@casl/ability'
import type { ForcedSubject } from '@casl/ability'
import type { Action, Department, Employee, Resource, VacationRequest } from '../models'

export type RecordSubject =
  | (Employee & ForcedSubject<'Employee'>)
  | (Department & ForcedSubject<'Department'>)
  | (VacationRequest & ForcedSubject<'VacationRequest'>)

export type AppAbility = MongoAbility<[Action, Resource | RecordSubject]>
