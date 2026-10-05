<script setup lang="ts">
import { RoutePath } from '@/shared/routes'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { EmployeeProfile } from '@/widgets/employee-profile'

const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <router-link
    :to="RoutePath.Employees"
    class="back-link"
  >
    {{ t('back') }}
  </router-link>
  <div class="page-heading">
    <h1>{{ t('employeeDetail') }}</h1>
  </div>
  <EmployeeProfile :id="String(route.params.id)" />
</template>
