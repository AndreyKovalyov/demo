<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiBadge, UiTable, sortTableRows } from '@sigma/ui-kit'
import type { TableColumn, TableFilter, TableSort } from '@sigma/ui-kit'
import { useTablePaginationLabels } from '@/shared/lib/table'
import { TABLE_ROWS } from './examples'

const { t } = useI18n()
const search = ref('')
const page = ref(1)
const pageSize = ref(2)
const sort = ref<TableSort | null>(null)
const paginationLabels = useTablePaginationLabels()
const filterFields = computed<TableFilter[]>(() => [
  { key: 'search', type: 'text', label: t('searchLabel') }
])
const columns = computed<TableColumn<(typeof TABLE_ROWS)[number]>[]>(() => [
  { key: 'name', label: t('name'), sort: true },
  {
    key: 'status',
    label: t('status'),
    sort: (a, b) => Number(a.status === 'active') - Number(b.status === 'active')
  }
])
const filtered = computed(() => {
  const needle = search.value.trim().toLocaleLowerCase()

  const matching = TABLE_ROWS.filter((row) => row.name.toLocaleLowerCase().includes(needle))

  return sortTableRows(matching, columns.value, sort.value)
})
const rows = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

watch([search, pageSize, sort], () => {
  page.value = 1
})

function changeFilter(_key: string, value: string) {
  search.value = value
}
</script>

<template>
  <UiTable
    v-model:page="page"
    v-model:page-size="pageSize"
    v-model:sort="sort"
    :rows="rows"
    :columns="columns"
    :total="filtered.length"
    :page-sizes="[2, 4]"
    :caption="t('example')"
    :empty-label="t('empty')"
    :actions-label="t('actions')"
    :retry-label="t('retry')"
    :pagination-labels="paginationLabels"
    :filter-fields="filterFields"
    :filter-values="{ search }"
    :filters-label="t('filters')"
    :reset-filters-label="t('reset')"
    @filter-change="changeFilter"
    @filter-reset="search = ''"
  >
    <template #cell-status="{ row }">
      <UiBadge :tone="row.status === 'active' ? 'success' : 'warning'">
        {{ t(row.status) }}
      </UiBadge>
    </template>
  </UiTable>
</template>
