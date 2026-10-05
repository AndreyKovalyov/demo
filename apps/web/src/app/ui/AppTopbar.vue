<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UiAvatar, UiButton, UiSelect } from '@sigma/ui-kit'
import { useSessionStore } from '@/entities/session'
import { AppIcon } from '@/shared/ui'
import { RoutePath, employeePath } from '@/shared/routes'
import { errorMessage } from '@/shared/api'
import { setLocale } from '@/shared/i18n'
import { usePreferences } from '@/shared/lib/preferences'
import { LANGUAGE_OPTIONS, TIME_ZONE_OPTIONS } from '@/shared/config/preferences'

const emit = defineEmits<{ error: [message: string] }>()
const { t, locale } = useI18n()
const session = useSessionStore()
const router = useRouter()
const { isDark, timeZone, toggleTheme, setTimeZone } = usePreferences()
const loggingOut = ref(false)
const roleLabel = computed(() => session.actor?.roles.map((role) => t(role)).join(', '))

async function logout() {
  if (loggingOut.value) {
    return
  }

  loggingOut.value = true
  emit('error', '')

  try {
    await session.logout()
    await router.replace(RoutePath.Login)
  } catch (error) {
    emit('error', errorMessage(error))
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header class="topbar">
    <span class="topbar__title">{{ session.isAuthenticated ? t('subtitle') : t('app') }}</span>

    <div class="topbar__controls">
      <UiSelect
        :model-value="locale"
        :options="LANGUAGE_OPTIONS"
        :aria-label="t('language')"
        @update:model-value="setLocale($event === 'en' ? 'en' : 'ru')"
      />
      <UiSelect
        v-if="session.isAuthenticated"
        :model-value="timeZone"
        :options="TIME_ZONE_OPTIONS"
        :aria-label="t('timezone')"
        @update:model-value="setTimeZone"
      />
      <UiButton
        variant="ghost"
        :aria-label="t('theme')"
        @click="toggleTheme"
      >
        <AppIcon :name="isDark ? 'sun' : 'moon'" />
      </UiButton>

      <template v-if="session.actor">
        <RouterLink
          class="topbar__user"
          :to="employeePath(session.actor.employeeId)"
          :aria-label="t('myProfile')"
        >
          <UiAvatar :name="session.actor.name" />
          <span class="topbar__user-name">
            {{ session.actor.name }}
            <small>{{ roleLabel }}</small>
          </span>
        </RouterLink>
        <UiButton
          variant="ghost"
          :loading="loggingOut"
          :aria-label="t('signOut')"
          @click="logout"
        >
          <AppIcon name="logout" />
        </UiButton>
      </template>
    </div>
  </header>
</template>
