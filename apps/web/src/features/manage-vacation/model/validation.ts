import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { MAX_LEAVE_DAYS, unixMs } from '@sigma/domain'
import { vacationDaysFromDates } from './period'
import { useFieldRules } from '@/shared/lib/validation'

interface VacationFields {
  startDate: Ref<number | null>
  endDate: Ref<number | null>
  reason: Ref<string>
}

function isDate(value: number | null): boolean {
  if (value === null) {
    return true
  }

  try {
    unixMs(value)

    return true
  } catch {
    return false
  }
}

export function useVacationValidation(fields: VacationFields) {
  const { t } = useI18n()
  const rules = useFieldRules()
  const validDate = helpers.withMessage(() => t('validationDate'), isDate)
  const validPeriod = helpers.withMessage(
    () => t('validationVacationPeriod', { count: MAX_LEAVE_DAYS }),
    () => {
      const days = vacationDaysFromDates(fields.startDate.value, fields.endDate.value)

      return days === null || (days >= 1 && days <= MAX_LEAVE_DAYS)
    }
  )

  return useVuelidate(
    {
      startDate: { required: rules.required, validDate },
      endDate: { required: rules.required, validDate, validPeriod },
      reason: {
        required: rules.required,
        minLength: rules.minLength(3),
        maxLength: rules.maxLength(240)
      }
    },
    fields
  )
}
