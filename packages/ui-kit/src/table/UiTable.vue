<script setup lang="ts" generic="T extends { id: string }">
import { computed } from 'vue'
import UiButton from '../UiButton.vue'
import UiPagination from './UiPagination.vue'
import UiSelect from '../select/UiSelect.vue'
import UiFilters from './UiFilters.vue'
import UiTableContent from './UiTableContent.vue'
import UiTableFilters from './UiTableFilters.vue'
import type {
  DataTableSlots,
  TableColumn,
  TableFilter,
  TablePaginationLabels,
  TableSort
} from './types'

const props = withDefaults(
  defineProps<{
    rows: readonly T[]
    columns: readonly TableColumn<T>[]
    caption: string
    emptyLabel: string
    actionsLabel?: string
    loading?: boolean
    error?: string
    retryLabel?: string
    total?: number | null
    pageSizes?: readonly number[]
    paginationLabels?: TablePaginationLabels
    filterFields?: readonly TableFilter[]
    filterValues?: Readonly<Record<string, string>>
    filtersLabel?: string
    resetFiltersLabel?: string
    compactFilters?: boolean
  }>(),
  {
    loading: false,
    error: '',
    actionsLabel: '',
    retryLabel: 'Загрузить ещё раз',
    total: null,
    pageSizes: () => [],
    filterFields: () => [],
    filterValues: () => ({}),
    filtersLabel: 'Фильтры',
    resetFiltersLabel: '',
    compactFilters: false,
    paginationLabels: () => ({
      label: 'Страницы',
      previous: 'Назад',
      next: 'Далее',
      pageSize: 'На странице'
    })
  }
)

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 16 })
const sort = defineModel<TableSort | null>('sort', { default: null })
const emit = defineEmits<{
  retry: []
  filterChange: [key: string, value: string]
  filterReset: []
}>()
const slots = defineSlots<DataTableSlots<T>>()
const cellSlots = computed(() =>
  Object.keys(slots).filter((name): name is `cell-${string}` => name.startsWith('cell-'))
)
const pageSizeValue = computed({
  get: () => String(pageSize.value),
  set: (value: string) => {
    pageSize.value = Number(value)
  }
})
const pageSizeOptions = computed(() =>
  props.pageSizes.map((value) => ({ value: String(value), label: String(value) }))
)
</script>

<template>
  <section class="ui-data-table">
    <div class="ui-data-table__body">
      <UiTableFilters
        v-if="filterFields.length || $slots.filters"
        :label="filtersLabel"
      >
        <slot name="filters">
          <UiFilters
            v-if="filterFields.length"
            :label="filtersLabel"
            :fields="filterFields"
            :values="filterValues"
            :reset-label="resetFiltersLabel"
            :compact="compactFilters"
            @change="(key, value) => emit('filterChange', key, value)"
            @reset="emit('filterReset')"
          />
        </slot>
        <template
          v-if="$slots['filter-summary']"
          #summary
        >
          <slot name="filter-summary" />
        </template>
      </UiTableFilters>
      <div
        v-if="$slots.toolbar"
        class="ui-data-table__toolbar"
      >
        <slot name="toolbar" />
      </div>
      <slot name="feedback" />
      <slot
        v-if="error"
        name="error"
        :error="error"
      >
        <div
          class="ui-data-table__error"
          role="alert"
        >
          <p>{{ error }}</p>
          <UiButton
            variant="secondary"
            @click="emit('retry')"
          >
            {{ retryLabel }}
          </UiButton>
        </div>
      </slot>
      <UiTableContent
        v-else
        :rows="rows"
        :columns="columns"
        :caption="caption"
        :empty-label="emptyLabel"
        :actions-label="actionsLabel"
        :loading="loading"
        :sort="sort"
        @sort-change="sort = $event"
      >
        <template
          v-for="name in cellSlots"
          #[name]="scope"
        >
          <slot
            :name="name"
            v-bind="scope"
          />
        </template>
        <template
          v-if="$slots.actions"
          #actions="{ row }"
        >
          <slot
            name="actions"
            :row="row"
          />
        </template>
      </UiTableContent>
    </div>
    <footer
      v-if="total !== null || $slots.pagination"
      class="ui-data-table__footer"
    >
      <slot name="pagination">
        <UiSelect
          v-if="pageSizes.length"
          v-model="pageSizeValue"
          :options="pageSizeOptions"
          :aria-label="paginationLabels.pageSize"
        />
        <UiPagination
          v-model="page"
          :total="total ?? 0"
          :page-size="pageSize"
          :disabled="loading"
          :previous-label="paginationLabels.previous"
          :next-label="paginationLabels.next"
          :label="paginationLabels.label"
        />
      </slot>
    </footer>
  </section>
</template>
