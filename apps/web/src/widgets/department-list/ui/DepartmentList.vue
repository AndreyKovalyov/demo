<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton } from '@sigma/ui-kit'
import { useDepartments } from '../model/use-departments'
import DepartmentCard from './DepartmentCard.vue'

const { t } = useI18n()
const { departments, employees, pending, error, load } = useDepartments()
</script>

<template>
  <div
    v-if="error"
    class="panel request-error"
    role="alert"
  >
    <p>{{ error }}</p>
    <UiButton
      variant="secondary"
      @click="load"
    >
      {{ t('retry') }}
    </UiButton>
  </div>

  <div
    v-else-if="pending"
    class="panel empty-panel"
    role="status"
  >
    {{ t('loading') }}
  </div>

  <div
    v-else
    class="department-grid"
  >
    <DepartmentCard
      v-for="department in departments.items"
      :key="department.id"
      :department="department"
      :manager="employees.byId[department.managerId]"
    />
  </div>
</template>
