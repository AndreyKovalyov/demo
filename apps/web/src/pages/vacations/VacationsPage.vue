<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VacationList } from '@/widgets/vacation-list'

const { t } = useI18n()
</script>

<template>
  <div class="page-heading">
    <h1>{{ t('vacations') }}</h1>
    <p class="text text--muted">{{ t('vacationsHint') }}</p>
  </div>
  <VacationList />
</template>
