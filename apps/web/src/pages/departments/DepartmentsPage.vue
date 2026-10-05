<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DepartmentList } from '@/widgets/department-list'

const { t } = useI18n()
</script>

<template>
  <div class="page-heading">
    <h1>{{ t('departments') }}</h1>
    <p class="text text--muted">{{ t('departmentsHint') }}</p>
  </div>
  <DepartmentList />
</template>
