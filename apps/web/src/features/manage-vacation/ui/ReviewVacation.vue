<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiButton } from '@sigma/ui-kit'
import { useSessionStore } from '@/entities/session'
import type { VacationRequest } from '@/entities/vacation'
import { errorMessage, isAborted } from '@/shared/api'
import { reviewVacation } from '../model/actions'

const props = defineProps<{ request: VacationRequest }>()
const emit = defineEmits<{ reviewed: [request: VacationRequest] }>()
const { t } = useI18n()
const session = useSessionStore()
const pending = ref(false)
const error = ref('')
const controller = new AbortController()

onBeforeUnmount(() => controller.abort())

async function review(status: 'approved' | 'rejected') {
  if (pending.value) {
    return
  }

  pending.value = true
  error.value = ''

  try {
    const updated = await reviewVacation(props.request, status, controller.signal)
    emit('reviewed', updated)
  } catch (caught) {
    if (!isAborted(caught)) {
      error.value = errorMessage(caught)
    }
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="review-actions">
    <div
      v-if="session.can('review', 'VacationRequest', request)"
      class="inline-actions"
    >
      <UiButton
        variant="secondary"
        :loading="pending"
        @click="review('approved')"
      >
        {{ t('approve') }}
      </UiButton>
      <UiButton
        variant="ghost"
        :disabled="pending"
        @click="review('rejected')"
      >
        {{ t('reject') }}
      </UiButton>
    </div>
    <span
      v-else-if="request.employeeId === session.actor?.employeeId && request.status === 'pending'"
      class="text text--muted text--small"
    >
      {{ t('ownVacation') }}
    </span>
    <p
      v-if="error"
      class="text error-message text--small"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
