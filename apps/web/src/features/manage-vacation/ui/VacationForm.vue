<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiButton, UiDatePicker, UiInput } from '@sigma/ui-kit'
import { unixMs } from '@sigma/domain'
import { errorMessage, isAborted } from '@/shared/api'
import { fieldError } from '@/shared/lib/validation'
import { requestVacation } from '../model/actions'
import { useVacationValidation } from '../model/validation'
import { vacationDaysFromDates } from '../model/period'

const emit = defineEmits<{ created: [] }>()
const { t, locale } = useI18n()
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)
const reason = ref('')
const pending = ref(false)
const error = ref('')
const controller = new AbortController()
const v$ = useVacationValidation({ startDate, endDate, reason })
const days = computed(() => vacationDaysFromDates(startDate.value, endDate.value) ?? 0)

onBeforeUnmount(() => controller.abort())

async function submit() {
  if (pending.value) {
    return
  }

  error.value = ''

  if (!(await v$.value.$validate()) || pending.value) {
    return
  }

  if (startDate.value === null || endDate.value === null) {
    return
  }

  pending.value = true

  try {
    await requestVacation(
      {
        startDate: unixMs(startDate.value),
        endDate: unixMs(endDate.value),
        reason: reason.value
      },
      controller.signal
    )
    emit('created')
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
  <form
    class="form-stack"
    novalidate
    @submit.prevent="submit"
  >
    <div class="form-row">
      <UiDatePicker
        v-model="startDate"
        :label="t('startDate')"
        :locale="locale"
        required
        :disabled="pending"
        :error="fieldError(v$.startDate)"
        @blur="v$.startDate.$touch()"
      />
      <UiDatePicker
        v-model="endDate"
        :label="t('endDate')"
        :locale="locale"
        :min="startDate"
        required
        :disabled="pending"
        :error="fieldError(v$.endDate)"
        @blur="v$.endDate.$touch()"
      />
    </div>
    <p class="text text--muted text--small">
      {{ t('vacationDaysHint') }}
      <strong v-if="days > 0">{{ t('days', { count: days }) }}</strong>
    </p>
    <UiInput
      v-model="reason"
      :label="t('reason')"
      :placeholder="t('reasonPlaceholder')"
      required
      minlength="3"
      maxlength="240"
      :disabled="pending"
      :error="fieldError(v$.reason)"
      @blur="v$.reason.$touch()"
    />
    <p
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </p>
    <div class="form-actions">
      <UiButton
        type="submit"
        :loading="pending"
      >
        {{ t('submit') }}
      </UiButton>
    </div>
  </form>
</template>
