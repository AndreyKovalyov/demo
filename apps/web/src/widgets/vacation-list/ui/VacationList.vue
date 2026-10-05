<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton, UiModal } from '@sigma/ui-kit'
import { useSessionStore } from '@/entities/session'
import { VacationForm } from '@/features/manage-vacation'
import { useVacationList } from '../model/use-vacation-list'
import VacationTable from './VacationTable.vue'

const { t } = useI18n()
const session = useSessionStore()
const {
  items,
  total,
  page,
  pageSize,
  status,
  sort,
  setStatus,
  changeFilter,
  pending,
  error,
  notice,
  showForm,
  load,
  created,
  reviewed
} = useVacationList()
</script>

<template>
  <div class="vacation-toolbar">
    <p class="text text--muted text--small">{{ t('accessHint') }}</p>
    <UiButton
      v-if="session.can('create', 'VacationRequest')"
      @click="showForm = true"
    >
      {{ t('newVacation') }}
    </UiButton>
  </div>
  <VacationTable
    v-model:page="page"
    v-model:sort="sort"
    :items="items"
    :pending="pending"
    :error="error"
    :notice="notice"
    :total="total"
    :page-size="pageSize"
    :filter-values="{ status }"
    @retry="load"
    @reviewed="reviewed"
    @filter-change="changeFilter"
    @filter-reset="setStatus('')"
  />
  <UiModal
    v-model="showForm"
    :title="t('newVacation')"
    :close-label="t('close')"
  >
    <VacationForm
      v-if="showForm"
      @created="created"
    />
  </UiModal>
</template>
