import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableFilter } from '@sigma/ui-kit'

export function useVacationFilterFields() {
  const { t } = useI18n()

  return computed<TableFilter[]>(() => [
    {
      key: 'status',
      type: 'select',
      label: t('status'),
      options: ['', 'pending', 'approved', 'rejected'].map((value) => ({
        value,
        label: value ? t(value) : t('allStatuses')
      }))
    }
  ])
}
