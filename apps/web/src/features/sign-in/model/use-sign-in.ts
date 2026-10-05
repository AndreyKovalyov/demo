import { RoutePath } from '@/shared/routes'
import { onBeforeUnmount, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useRoute, useRouter } from 'vue-router'
import { Role, useSessionStore } from '@/entities/session'
import { errorMessage, isAborted } from '@/shared/api'
import { useFieldRules } from '@/shared/lib/validation'

export function useSignIn() {
  const session = useSessionStore()
  const router = useRouter()
  const route = useRoute()
  const email = ref('manager@demo.ru')
  const password = ref('demo1234')
  const pending = ref(false)
  const error = ref('')
  const controller = new AbortController()
  const rules = useFieldRules()
  const v$ = useVuelidate(
    {
      email: { required: rules.required, email: rules.email },
      password: { required: rules.required }
    },
    { email, password }
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
      await session.login(email.value, password.value, controller.signal)
      const redirect =
        typeof route.query.redirect === 'string' &&
        route.query.redirect.startsWith('/') &&
        !route.query.redirect.startsWith('//') &&
        !route.query.redirect.startsWith(RoutePath.Login)
          ? route.query.redirect
          : RoutePath.Employees
      await router.replace(redirect)
    } catch (caught) {
      if (!isAborted(caught)) {
        error.value = errorMessage(caught)
      }
    } finally {
      pending.value = false
    }
  }

  function selectAccount(role: Role) {
    email.value = `${role}@demo.ru`
    password.value = 'demo1234'
    error.value = ''
    v$.value.$reset()
  }

  return { email, password, pending, error, v$, submit, selectAccount }
}
