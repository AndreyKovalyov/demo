<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton } from '@sigma/ui-kit'

defineProps<{ pending: boolean; total: number }>()
const emit = defineEmits<{ cancel: []; reload: [] }>()
const { t } = useI18n()
</script>

<template>
  <span
    class="text text--muted text--small"
    aria-live="polite"
  >
    {{ pending ? t('loadingEmployees') : t('total', { count: total }) }}
  </span>

  <div class="inline-actions">
    <UiButton
      v-if="pending"
      variant="ghost"
      @click="emit('cancel')"
    >
      {{ t('cancelRequest') }}
    </UiButton>
    <UiButton
      v-else
      variant="ghost"
      @click="emit('reload')"
    >
      {{ t('reload') }}
    </UiButton>
  </div>
</template>
