<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { TableSort } from '@sigma/ui-kit'
import { EMPLOYEE_SORT_KEYS } from '@/entities/employee'
import { useEmployeeList } from '../model/use-employee-list'
import EmployeeToolbar from './EmployeeToolbar.vue'
import EmployeeTable from './EmployeeTable.vue'

const { t } = useI18n()
const {
  query,
  filterValues,
  changeFilter,
  rows,
  total,
  pending,
  error,
  cancelled,
  load,
  cancel,
  reset,
  setQuery
} = useEmployeeList()

const sort = computed<TableSort | null>({
  get: () => ({ key: query.value.sort, direction: query.value.direction }),
  set: (value) => {
    if (!value) {
      return
    }

    const key = EMPLOYEE_SORT_KEYS.find((item) => item === value.key)

    if (key) {
      setQuery({ sort: key, direction: value.direction })
    }
  }
})
</script>

<template>
  <EmployeeTable
    v-model:sort="sort"
    :rows="rows"
    :total="total"
    :pending="pending"
    :error="error"
    :page="query.page"
    :page-size="query.pageSize"
    :filter-values="filterValues"
    @update:page="setQuery({ page: $event }, false)"
    @update:page-size="setQuery({ pageSize: $event })"
    @retry="load"
    @filter-change="changeFilter"
    @filter-reset="reset"
  >
    <template #toolbar>
      <EmployeeToolbar
        :pending="pending"
        :total="total"
        @cancel="cancel"
        @reload="load"
      />
    </template>
    <template #feedback>
      <p
        v-if="cancelled"
        class="notice"
        role="status"
      >
        {{ t('cancellation') }}
      </p>
    </template>
  </EmployeeTable>
</template>
