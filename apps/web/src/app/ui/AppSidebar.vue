<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/entities/session'
import { RoutePath } from '@/shared/routes'
import { AppIcon } from '@/shared/ui'
import { NAVIGATION_ITEMS } from '../config/navigation'

const { t } = useI18n()
const route = useRoute()
const session = useSessionStore()

const navigation = computed(() =>
  NAVIGATION_ITEMS.filter(
    (item) => !('resource' in item) || session.can(item.action, item.resource)
  )
)
</script>

<template>
  <aside class="sidebar">
    <router-link
      :to="RoutePath.Employees"
      class="brand"
    >
      {{ t('app') }}
    </router-link>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        class="sidebar-nav__link"
        :class="{ 'sidebar-nav__link--active': route.path.startsWith(item.path) }"
      >
        <AppIcon :name="item.icon" />
        {{ t(item.label) }}
      </router-link>
    </nav>
  </aside>
</template>
