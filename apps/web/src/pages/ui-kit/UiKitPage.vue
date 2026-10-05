<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiAvatar, UiBadge, UiButton, UiModal } from '@sigma/ui-kit'
import { usePreferences } from '@/shared/lib/preferences'
import UiKitTableExample from './UiKitTableExample.vue'
import UiKitFieldsExample from './UiKitFieldsExample.vue'

const { t } = useI18n()
const { theme, toggleTheme } = usePreferences()
const open = ref(false)
</script>

<template>
  <div class="page-heading">
    <h1>{{ t('uiKit') }}</h1>
    <p class="text text--muted">{{ t('uiHint') }}</p>
  </div>
  <section class="panel showcase">
    <h2>{{ t('buttons') }}</h2>
    <div class="inline-actions">
      <UiButton>{{ t('save') }}</UiButton>
      <UiButton variant="secondary">{{ t('cancel') }}</UiButton>
      <UiButton variant="ghost">{{ t('edit') }}</UiButton>
      <UiButton disabled>{{ t('save') }}</UiButton>
      <UiButton loading>{{ t('loading') }}</UiButton>
    </div>
  </section>
  <UiKitFieldsExample />
  <section class="panel showcase">
    <h2>{{ t('badges') }}</h2>
    <div class="inline-actions">
      <UiBadge tone="success">{{ t('active') }}</UiBadge>
      <UiBadge tone="warning">{{ t('pending') }}</UiBadge>
      <UiBadge tone="danger">{{ t('rejected') }}</UiBadge>
      <UiBadge tone="info">{{ t('manager') }}</UiBadge>
      <UiAvatar name="Анна Смирнова" />
      <UiAvatar
        name="Михаил Орлов"
        color="green"
      />
    </div>
  </section>
  <section class="panel showcase">
    <h2>{{ t('modal') }}</h2>
    <div class="inline-actions">
      <UiButton
        variant="secondary"
        @click="open = true"
      >
        {{ t('open') }}
      </UiButton>
      <UiButton
        variant="secondary"
        @click="toggleTheme"
      >
        {{ t('theme') }} · {{ t(theme) }}
      </UiButton>
    </div>
  </section>
  <div class="page-heading">
    <h2>{{ t('table') }}</h2>
  </div>
  <UiKitTableExample />
  <UiModal
    v-model="open"
    :title="t('example')"
    :close-label="t('close')"
  >
    <p>{{ t('demoDialog') }}</p>
    <div class="form-actions">
      <UiButton @click="open = false">{{ t('close') }}</UiButton>
    </div>
  </UiModal>
</template>
