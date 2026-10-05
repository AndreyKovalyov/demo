<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Employee } from '@/entities/employee'
import { useSessionStore } from '@/entities/session'
import { employeePath } from '@/shared/routes'
import { formatInstant } from '@/shared/lib/dates'
import { formatSalary } from '@/shared/lib/format'

defineProps<{
  employee: Employee
  department: string
  manager: Employee | undefined
  deputy: Employee | undefined
}>()

const { t, locale } = useI18n()
const session = useSessionStore()
</script>

<template>
  <dl class="profile-details">
    <div>
      <dt>{{ t('email') }}</dt>
      <dd>
        <a :href="`mailto:${employee.email}`">{{ employee.email }}</a>
      </dd>
    </div>
    <div>
      <dt>{{ t('department') }}</dt>
      <dd>{{ department }}</dd>
    </div>
    <div>
      <dt>{{ t('joined') }}</dt>
      <dd>{{ formatInstant(employee.joinedAt, locale) }}</dd>
    </div>
    <div>
      <dt>{{ t('salary') }}</dt>
      <dd v-if="session.can('readSalary', 'Employee', employee) && employee.salary !== undefined">
        {{ formatSalary(employee.salary, locale) }}
      </dd>
      <dd
        v-else
        class="text text--muted"
      >
        {{ t('privateSalary') }}
      </dd>
    </div>
    <div>
      <dt>{{ t('manager') }}</dt>
      <dd>
        <router-link
          v-if="employee.managerId && manager"
          :to="employeePath(employee.managerId)"
        >
          {{ manager?.name }}
        </router-link>
        <span v-else>{{ t('noManager') }}</span>
      </dd>
    </div>
    <div v-if="employee.kind === 'manager'">
      <dt>{{ t('deputy') }}</dt>
      <dd>
        <router-link
          v-if="employee.deputyId && deputy"
          :to="employeePath(employee.deputyId)"
        >
          {{ deputy?.name }}
        </router-link>
        <span v-else>{{ t('noDeputy') }}</span>
      </dd>
    </div>
  </dl>
</template>
