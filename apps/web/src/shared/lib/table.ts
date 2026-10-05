import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TablePaginationLabels } from '@sigma/ui-kit'

export function useTablePaginationLabels() {
  const { t } = useI18n()

  return computed<TablePaginationLabels>(() => ({
    label: t('pagination'),
    previous: t('previous'),
    next: t('next'),
    pageSize: t('resultsPerPage')
  }))
}
