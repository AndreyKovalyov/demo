<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UiBadge, UiButton, UiTable } from '@sigma/ui-kit'
import type { TableColumn, TableSort } from '@sigma/ui-kit'
import { EmployeeSummary } from '@/entities/employee'
import type { Employee } from '@/entities/employee'
import { useDepartmentsStore } from '@/entities/department'
import { employeePath } from '@/shared/routes'
import { useTablePaginationLabels } from '@/shared/lib/table'
import { formatInstant } from '@/shared/lib/dates'
import { PAGE_SIZES } from '../model/query'
import { useEmployeeFilterFields } from '../model/use-filter-fields'

defineProps<{
  rows: readonly Employee[]
  total: number
  pending: boolean
  error: string
  filterValues: Readonly<Record<string, string>>
}>()
const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })
const sort = defineModel<TableSort | null>('sort', { required: true })
const emit = defineEmits<{
  retry: []
  filterChange: [key: string, value: string]
  filterReset: []
}>()
const { t, locale } = useI18n()
const router = useRouter()
const departments = useDepartmentsStore()
const paginationLabels = useTablePaginationLabels()
const filterFields = useEmployeeFilterFields()
const columns = computed<TableColumn<Employee>[]>(() => [
  { key: 'name', label: t('name'), sort: true },
  { key: 'departmentId', label: t('department'), sort: true },
  { key: 'position', label: t('position'), sort: true },
  { key: 'joinedAt', label: t('joined'), sort: true },
  { key: 'status', label: t('status'), sort: true }
])
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:page-size="pageSize"
    v-model:sort="sort"
    class="list-table"
    :rows="rows"
    :columns="columns"
    :total="total"
    :loading="pending"
    :error="error"
    :page-sizes="PAGE_SIZES"
    :caption="t('employees')"
    :empty-label="pending ? t('loadingEmployees') : t('empty')"
    :actions-label="t('actions')"
    :retry-label="t('retry')"
    :pagination-labels="paginationLabels"
    :filter-fields="filterFields"
    :filter-values="filterValues"
    :filters-label="t('filters')"
    :reset-filters-label="t('reset')"
    @retry="emit('retry')"
    @filter-change="(key, value) => emit('filterChange', key, value)"
    @filter-reset="emit('filterReset')"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>
    <template #feedback>
      <slot name="feedback" />
    </template>
    <template #cell-name="{ row }">
      <router-link
        :to="employeePath(row.id)"
        class="employee-link"
      >
        <EmployeeSummary :employee="row" />
      </router-link>
    </template>
    <template #cell-departmentId="{ row }">
      {{ departments.nameOf(row.departmentId) }}
    </template>
    <template #cell-status="{ row }">
      <UiBadge :tone="row.status === 'active' ? 'success' : 'warning'">
        {{ t(row.status) }}
      </UiBadge>
    </template>
    <template #cell-joinedAt="{ row }">
      {{ formatInstant(row.joinedAt, locale) }}
    </template>
    <template #actions="{ row }">
      <UiButton
        variant="ghost"
        :aria-label="`${t('open')}: ${row.name}`"
        @click="router.push(employeePath(row.id))"
      >
        {{ t('open') }}
      </UiButton>
    </template>
  </UiTable>
</template>
