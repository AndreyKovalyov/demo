import { createI18n } from 'vue-i18n'
import { readPreference, writePreference } from '@/shared/lib/preferences'
import ru from './ru'
import en from './en'

const initialLocale = readPreference('sigma-locale') === 'en' ? 'en' : 'ru'
export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'ru',
  messages: { ru, en }
})
document.documentElement.lang = initialLocale

export function setLocale(value: 'ru' | 'en') {
  i18n.global.locale.value = value
  document.documentElement.lang = value
  writePreference('sigma-locale', value)
}
