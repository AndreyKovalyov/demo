<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useI18n } from 'vue-i18n'
import { UiButton, UiInput, UiSelect } from '@sigma/ui-kit'
import { useEmployeesStore } from '@/entities/employee'
import type { Employee, EmployeeStatus } from '@/entities/employee'
import { errorMessage, isAborted } from '@/shared/api'
import { fieldError, useFieldRules } from '@/shared/lib/validation'
import { updateEmployee } from '../model/action'

const props = defineProps<{ employee: Employee }>()
const emit = defineEmits<{ saved: [] }>()
const { t } = useI18n()
const store = useEmployeesStore()
const name = ref(props.employee.name)
const position = ref(props.employee.position)
const status = ref<EmployeeStatus>(props.employee.status)
const options = computed(() => [
  { value: 'active' as const, label: t('active') },
  { value: 'on-vacation' as const, label: t('on-vacation') }
])
const pending = ref(false)
const error = ref('')
const controller = new AbortController()
const rules = useFieldRules()
const v$ = useVuelidate(
  {
    name: {
      required: rules.required,
      minLength: rules.minLength(2),
      maxLength: rules.maxLength(80)
    },
    position: {
      required: rules.required,
      minLength: rules.minLength(2),
      maxLength: rules.maxLength(80)
    }
  },
  { name, position }
)

onBeforeUnmount(() => controller.abort())

async function submit() {
  if (pending.value) {
    return
  }

  error.value = ''

  if (!(await v$.value.$validate()) || pending.value) {
    return
  }

  pending.value = true

  try {
    const item = await updateEmployee(
      props.employee,
      { name: name.value, position: position.value, status: status.value },
      controller.signal
    )
    store.upsert([item])
    emit('saved')
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
    <UiInput
      v-model="name"
      :label="t('employeeName')"
      required
      minlength="2"
      maxlength="80"
      :error="fieldError(v$.name)"
      :disabled="pending"
      @blur="v$.name.$touch()"
    />
    <UiInput
      v-model="position"
      :label="t('position')"
      required
      minlength="2"
      maxlength="80"
      :error="fieldError(v$.position)"
      :disabled="pending"
      @blur="v$.position.$touch()"
    />
    <UiSelect
      v-model="status"
      :label="t('status')"
      :options="options"
      :disabled="pending"
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
        {{ t('save') }}
      </UiButton>
    </div>
  </form>
</template>
