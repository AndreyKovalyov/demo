import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Action, Actor, Department, Employee, VacationRequest, Resource } from '@sigma/domain'
import { canAccess, defineAbility } from '@sigma/domain/access'
import { ApiError } from '@/shared/api'
import { authApi } from '../api/requests'

export const useSessionStore = defineStore('session', () => {
  const actor = ref<Actor | null>(null)
  const ready = ref(false)
  const ability = computed(() => defineAbility(actor.value))
  const isAuthenticated = computed(() => !!actor.value)

  function can(
    action: Action,
    resource: Resource,
    record?: Employee | Department | VacationRequest
  ) {
    return canAccess(ability.value, action, resource, record)
  }

  async function restore() {
    try {
      actor.value = await authApi.current()
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        throw error
      }
    } finally {
      ready.value = true
    }
  }

  async function login(email: string, password: string, signal?: AbortSignal) {
    actor.value = await authApi.login(email, password, signal)
    ready.value = true
  }

  function clear() {
    actor.value = null
  }

  async function logout() {
    await authApi.logout()
    clear()
  }

  return { actor, ready, ability, isAuthenticated, can, restore, login, logout, clear }
})
