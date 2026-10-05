<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiBadge, UiTable } from '@sigma/ui-kit'
import type { TableColumn, TableSort } from '@sigma/ui-kit'
import { vacationDays } from '@/entities/vacation'
import type { VacationRequest } from '@/entities/vacation'
import { ReviewVacation } from '@/features/manage-vacation'
import { employeePath } from '@/shared/routes'
import { formatDateOnly, formatInstant } from '@/shared/lib/dates'
import { useTablePaginationLabels } from '@/shared/lib/table'
import { STATUS_TONES } from '../model/status'
import { useVacationFilterFields } from '../model/use-filter-fields'

defineProps<{
  items: readonly VacationRequest[]
  pending: boolean
  error: string
  notice: string
  total: number
  pageSize: number
  filterValues: Readonly<Record<string, string>>
}>()
const page = defineModel<number>('page', { required: true })
const sort = defineModel<TableSort | null>('sort', { required: true })
const emit = defineEmits<{
  reviewed: [request: VacationRequest]
  retry: []
  filterChange: [key: string, value: string]
  filterReset: []
}>()
const { t, locale } = useI18n()
const paginationLabels = useTablePaginationLabels()
const filterFields = useVacationFilterFields()

const columns = computed<TableColumn<VacationRequest>[]>(() => [
  { key: 'employeeName', label: t('name'), sort: true },
  { key: 'startDate', label: t('period'), sort: true },
  { key: 'reason', label: t('reason'), sort: true },
  { key: 'status', label: t('status'), sort: true }
])
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:sort="sort"
    class="list-table"
    :page-size="pageSize"
    :rows="items"
    :columns="columns"
    :total="total"
    :error="error"
    :caption="t('vacations')"
    :empty-label="pending ? t('loadingVacations') : t('emptyVacations')"
    :actions-label="t('actions')"
    :loading="pending"
    :retry-label="t('retry')"
    :pagination-labels="paginationLabels"
    :filter-fields="filterFields"
    :filter-values="filterValues"
    :filters-label="t('filters')"
    :reset-filters-label="t('reset')"
    compact-filters
    @retry="emit('retry')"
    @filter-change="(key, value) => emit('filterChange', key, value)"
    @filter-reset="emit('filterReset')"
  >
    <template #filter-summary>
      <div class="vacation-summary">
        <span
          class="vacation-summary__notice"
          role="status"
        >
          {{ notice ? t(notice) : '' }}
        </span>
        <span
          class="text text--muted text--small"
          aria-live="polite"
        >
          {{ pending ? t('loadingVacations') : t('total', { count: total }) }}
        </span>
      </div>
    </template>
    <template #cell-employeeName="{ row }">
      <router-link :to="employeePath(row.employeeId)">{{ row.employeeName }}</router-link>
      <div class="text text--muted text--small">
        {{ formatInstant(row.createdAt, locale, true) }}
      </div>
    </template>
    <template #cell-startDate="{ row }">
      {{ formatDateOnly(row.startDate, locale) }} – {{ formatDateOnly(row.endDate, locale) }}
      <div class="text text--muted text--small">
        {{ t('days', { count: vacationDays(row) }) }}
      </div>
    </template>
    <template #cell-reason="{ row }">
      <span class="vacation-reason">{{ row.reason }}</span>
    </template>
    <template #cell-status="{ row }">
      <UiBadge :tone="STATUS_TONES[row.status]">
        {{ t(row.status) }}
      </UiBadge>
    </template>
    <template #actions="{ row }">
      <ReviewVacation
        :request="row"
        @reviewed="emit('reviewed', $event)"
      />
    </template>
  </UiTable>
</template>
