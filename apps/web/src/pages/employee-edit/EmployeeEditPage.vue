<script setup lang="ts">
import { employeePath } from '@/shared/routes'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { EmployeeProfile } from '@/widgets/employee-profile'

const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <router-link
    :to="employeePath(String(route.params.id))"
    class="back-link"
  >
    {{ t('employeeDetail') }}
  </router-link>
  <div class="page-heading">
    <h1>{{ t('employeeEdit') }}</h1>
  </div>
  <EmployeeProfile
    :id="String(route.params.id)"
    editable
  />
</template>
