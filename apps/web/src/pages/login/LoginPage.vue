<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SignInForm } from '@/features/sign-in'

const { t } = useI18n()
</script>

<template>
  <div class="login-page">
    <section class="panel login-card">
      <h1>{{ t('loginTitle') }}</h1>
      <p class="text text--muted login-card__hint">{{ t('loginHint') }}</p>
      <SignInForm />
    </section>
    <p class="text text--muted text--small login-note">{{ t('loginNote') }}</p>
  </div>
</template>
