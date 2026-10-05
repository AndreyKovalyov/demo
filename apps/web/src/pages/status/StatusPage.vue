<script setup lang="ts">
import { RoutePath, RouteName } from '@/shared/routes'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
</script>

<template>
  <div class="panel empty-panel">
    <h1>{{ t(route.name === RouteName.Forbidden ? 'forbidden' : 'notFound') }}</h1>
    <p
      v-if="route.name === RouteName.Forbidden"
      class="text text--muted"
    >
      {{ t('forbiddenHint') }}
    </p>
    <router-link :to="RoutePath.Employees">{{ t('back') }}</router-link>
  </div>
</template>
