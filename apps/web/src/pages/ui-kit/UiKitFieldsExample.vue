<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UiDatePicker, UiInput, UiSelect } from '@sigma/ui-kit'

const { t, locale } = useI18n()
const value = ref('')
const status = ref('')
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)
const options = computed(() => [
  { value: 'active', label: t('active') },
  { value: 'on-vacation', label: t('on-vacation') }
])
</script>

<template>
  <section class="panel showcase">
    <h2>{{ t('fields') }}</h2>
    <div class="form-stack">
      <div class="form-row">
        <UiInput
          v-model="value"
          :label="t('example')"
          :placeholder="t('employeeName')"
        />
        <UiInput
          :label="t('email')"
          model-value="invalid"
          :error="t('validationEmail')"
        />
      </div>
      <div class="form-row">
        <UiSelect
          v-model="status"
          :label="t('status')"
          :options="options"
          :placeholder="t('selectStatus')"
          :error="status === '' ? t('validationRequired') : ''"
        />
        <UiSelect
          model-value="active"
          :label="t('example')"
          :options="options"
          disabled
        />
      </div>
      <div class="form-row">
        <UiDatePicker
          v-model="startDate"
          :label="t('startDate')"
          :locale="locale"
          :max="endDate"
        />
        <UiDatePicker
          v-model="endDate"
          :label="t('endDate')"
          :locale="locale"
          :min="startDate"
        />
      </div>
    </div>
  </section>
</template>
