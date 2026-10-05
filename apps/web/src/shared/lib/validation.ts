import { unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { email, helpers, maxLength, minLength, required } from '@vuelidate/validators'
import type { ErrorObject } from '@vuelidate/core'

export function fieldError(field: { $errors: ErrorObject[] }): string {
  return String(unref(field.$errors[0]?.$message) ?? '')
}

export function useFieldRules() {
  const { t } = useI18n()

  return {
    required: helpers.withMessage(() => t('validationRequired'), required),
    email: helpers.withMessage(() => t('validationEmail'), email),
    minLength: (count: number) =>
      helpers.withMessage(
        () => t('validationMinLength', { count }),
        (value: string) => minLength(count).$validator(value.trim(), {}, {})
      ),
    maxLength: (count: number) =>
      helpers.withMessage(() => t('validationMaxLength', { count }), maxLength(count))
  }
}
