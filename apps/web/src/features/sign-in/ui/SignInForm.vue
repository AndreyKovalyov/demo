<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { UiButton, UiInput } from '@sigma/ui-kit'
import { Role } from '@/entities/session'
import { fieldError } from '@/shared/lib/validation'
import { useSignIn } from '../model/use-sign-in'

const { t } = useI18n()
const { email, password, pending, error, v$, submit, selectAccount } = useSignIn()
</script>

<template>
  <form
    class="form-stack"
    novalidate
    @submit.prevent="submit"
  >
    <UiInput
      v-model="email"
      type="email"
      :label="t('email')"
      autocomplete="username"
      required
      :disabled="pending"
      :error="fieldError(v$.email)"
      @blur="v$.email.$touch()"
    />
    <UiInput
      v-model="password"
      type="password"
      :label="t('password')"
      autocomplete="current-password"
      required
      :disabled="pending"
      :error="fieldError(v$.password)"
      @blur="v$.password.$touch()"
    />
    <p
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </p>
    <UiButton
      type="submit"
      :loading="pending"
    >
      {{ t('signIn') }}
    </UiButton>
  </form>
  <div class="demo-accounts">
    <p class="text text--small">{{ t('demoAccounts') }}</p>
    <div class="inline-actions">
      <UiButton
        v-for="role in [Role.Manager, Role.Employee]"
        :key="role"
        variant="secondary"
        :disabled="pending"
        @click="selectAccount(role)"
      >
        {{ t(role) }}
      </UiButton>
    </div>
    <p class="text text--muted text--small">{{ t('demoPassword') }}</p>
  </div>
</template>
