<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { EmployeeSummary } from '@/entities/employee'
import type { Employee } from '@/entities/employee'
import { employeePath } from '@/shared/routes'

defineProps<{ items: readonly Employee[] }>()
const { t } = useI18n()
</script>

<template>
  <section class="panel team-panel">
    <h2>{{ t('team') }}</h2>
    <div
      class="team-list"
      role="region"
      :aria-label="t('team')"
      tabindex="0"
    >
      <router-link
        v-for="person in items"
        :key="person.id"
        :to="employeePath(person.id)"
        class="employee-link"
      >
        <EmployeeSummary :employee="person" />
      </router-link>
    </div>
  </section>
</template>
