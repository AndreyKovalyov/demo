<script setup lang="ts">
import { employeePath, employeeEditPath } from '@/shared/routes'
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UiAvatar, UiBadge, UiButton } from '@sigma/ui-kit'
import { useSessionStore } from '@/entities/session'
import { EditEmployeeForm } from '@/features/edit-employee'
import ProfileDetails from './ProfileDetails.vue'
import ProfileTeam from './ProfileTeam.vue'
import { useProfile } from '../model/use-profile'

const props = defineProps<{ id: string; editable?: boolean }>()
const { t } = useI18n()
const router = useRouter()
const session = useSessionStore()
const { employee, employees, departments, team, pending, error, load } = useProfile(
  toRef(props, 'id')
)
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
  <template v-else-if="employee">
    <section class="panel profile-panel">
      <header class="profile-header">
        <UiAvatar
          :name="employee.name"
          large
        />
        <div>
          <h2>{{ employee.name }}</h2>
          <p class="text text--muted">{{ employee.position }}</p>
        </div>
        <UiBadge :tone="employee.status === 'active' ? 'success' : 'warning'">
          {{ t(employee.status) }}
        </UiBadge>
        <UiButton
          v-if="!editable && session.can('update', 'Employee', employee)"
          class="profile-header__action"
          variant="secondary"
          @click="router.push(employeeEditPath(id))"
        >
          {{ t('edit') }}
        </UiButton>
      </header>
      <EditEmployeeForm
        v-if="editable"
        :employee="employee"
        @saved="router.push(employeePath(id))"
      />

      <ProfileDetails
        v-else
        :employee="employee"
        :department="departments.nameOf(employee.departmentId)"
        :manager="employee.managerId ? employees.byId[employee.managerId] : undefined"
        :deputy="
          employee.kind === 'manager' && employee.deputyId
            ? employees.byId[employee.deputyId]
            : undefined
        "
      />
    </section>
    <ProfileTeam
      v-if="employee.kind === 'manager' && !editable"
      :items="team"
    />
  </template>
</template>
