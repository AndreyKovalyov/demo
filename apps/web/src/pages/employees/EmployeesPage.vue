<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { EmployeeList } from '@/widgets/employee-list'

const { t } = useI18n()
</script>

<template>
  <div class="page-heading">
    <h1>{{ t('employees') }}</h1>
    <p class="text text--muted">{{ t('employeesHint') }}</p>
  </div>
  <EmployeeList />
</template>
