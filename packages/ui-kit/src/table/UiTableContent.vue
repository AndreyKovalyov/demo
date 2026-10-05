<script setup lang="ts" generic="T extends { id: string }">
import { computed } from 'vue'
import UiTableSortIcon from './UiTableSortIcon.vue'
import { columnSortKey } from './sorting'
import type { TableCellSlots, TableColumn, TableSort } from './types'

defineSlots<TableCellSlots<T>>()

const props = withDefaults(
  defineProps<{
    rows: readonly T[]
    columns: readonly TableColumn<T>[]
    caption: string
    loading?: boolean
    emptyLabel: string
    actionsLabel?: string
    sort?: TableSort | null
  }>(),
  { sort: null, actionsLabel: '', loading: false }
)

const emit = defineEmits<{ sortChange: [sort: TableSort] }>()
const headings = computed(() =>
  props.columns.map((column) => {
    const sortKey = columnSortKey(column)
    const active = Boolean(sortKey && props.sort?.key === sortKey)
    const descending = active && props.sort?.direction === 'desc'

    return { column, sortKey, active, descending, ariaSort: columnAriaSort(sortKey) }
  })
)
const sortable = computed(() => headings.value.some((heading) => heading.sortKey))

function columnAriaSort(key: string | null) {
  if (!key) {
    return undefined
  }

  if (props.sort?.key !== key) {
    return 'none' as const
  }

  return props.sort.direction === 'asc' ? ('ascending' as const) : ('descending' as const)
}

function toggleSort(key: string) {
  const direction = props.sort?.key === key && props.sort.direction === 'asc' ? 'desc' : 'asc'

  emit('sortChange', { key, direction })
}
</script>

<template>
  <div
    class="ui-table-wrap"
    :aria-busy="loading"
    role="region"
    :aria-label="caption"
    tabindex="0"
  >
    <table class="ui-table">
      <caption class="sr-only">
        {{ caption }}
      </caption>
      <thead :class="{ 'ui-table__head--sortable': sortable }">
        <tr>
          <th
            v-for="heading in headings"
            :key="heading.column.key"
            :class="{ 'ui-table__heading--sortable': heading.sortKey }"
            :aria-sort="heading.ariaSort"
            scope="col"
          >
            <button
              v-if="heading.sortKey"
              class="ui-table__sort"
              :class="{ 'ui-table__sort--active': heading.active }"
              @click="toggleSort(heading.sortKey)"
            >
              {{ heading.column.label }}
              <UiTableSortIcon :descending="heading.descending" />
            </button>
            <template v-else>{{ heading.column.label }}</template>
          </th>
          <th
            v-if="$slots.actions"
            scope="col"
          >
            <span class="sr-only">{{ actionsLabel }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :data-label="column.label"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
            >
              {{ row[column.key] }}
            </slot>
          </td>
          <td
            v-if="$slots.actions"
            class="ui-table__actions"
          >
            <slot
              name="actions"
              :row="row"
            />
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="ui-table__empty"
          >
            {{ emptyLabel }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
