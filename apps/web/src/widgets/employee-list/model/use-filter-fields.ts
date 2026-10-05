import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TableFilter } from '@sigma/ui-kit'
import { useDepartmentsStore } from '@/entities/department'
import { useSessionStore } from '@/entities/session'

export function useEmployeeFilterFields() {
  const { t } = useI18n()
  const departments = useDepartmentsStore()
  const session = useSessionStore()

  return computed<TableFilter[]>(() => [
    { key: 'search', type: 'text', label: t('searchLabel'), placeholder: t('search') },
    ...(session.can('list', 'Department')
      ? [
          {
            key: 'department',
            type: 'select' as const,
            label: t('department'),
            options: [
              { value: '', label: t('allDepartments') },
              ...departments.items.map((item) => ({ value: item.id, label: item.name }))
            ]
          }
        ]
      : []),
    {
      key: 'status',
      type: 'select',
      label: t('status'),
      options: [
        { value: '', label: t('allStatuses') },
        { value: 'active', label: t('active') },
        { value: 'on-vacation', label: t('on-vacation') }
      ]
    }
  ])
}
