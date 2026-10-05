import { subject } from '@casl/ability'
import type { Department, Employee, VacationRequest } from '../models'
import type { RecordSubject } from './types'

export function toRecordSubject(record: Employee | Department | VacationRequest): RecordSubject {
  if ('kind' in record) {
    return subject('Employee', record)
  }
  if ('startDate' in record) {
    return subject('VacationRequest', record)
  }

  return subject('Department', record)
}
