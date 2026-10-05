<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiBadge } from '@sigma/ui-kit'
import type { Department } from '@/entities/department'
import { EmployeeSummary } from '@/entities/employee'
import type { Employee } from '@/entities/employee'
import { employeePath, RoutePath } from '@/shared/routes'

defineProps<{ department: Department; manager: Employee | undefined }>()
const { t } = useI18n()
</script>

<template>
  <section class="panel department-card">
    <div class="department-card__header">
      <h2>{{ department.name }}</h2>
      <UiBadge>{{ t('members', { count: department.memberCount }) }}</UiBadge>
    </div>

    <p class="text text--muted department-card__description">{{ department.description }}</p>

    <div class="department-card__manager">
      <p class="text text--muted text--small">{{ t('manager') }}</p>
      <router-link
        v-if="manager"
        :to="employeePath(manager.id)"
        class="employee-link"
      >
        <EmployeeSummary :employee="manager" />
      </router-link>
    </div>

    <router-link
      :to="{ path: RoutePath.Employees, query: { department: department.id } }"
      class="department-card__link"
    >
      {{ t('viewDepartment') }}
    </router-link>
  </section>
</template>
