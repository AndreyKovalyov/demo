<script setup lang="ts">
import { UiAvatar } from '@sigma/ui-kit'
import type { Employee } from '@sigma/domain'

defineProps<{ employee: Employee }>()
</script>

<template>
  <div class="employee-summary">
    <UiAvatar :name="employee.name" />
    <div>
      <div class="employee-summary__name">{{ employee.name }}</div>
      <div class="text text--muted text--small">{{ employee.email }}</div>
    </div>
  </div>
</template>
