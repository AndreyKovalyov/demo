<script setup lang="ts">
import { ref } from 'vue'
import { useSessionStore } from '@/entities/session'
import AppSidebar from './ui/AppSidebar.vue'
import AppTopbar from './ui/AppTopbar.vue'

const session = useSessionStore()
const error = ref('')
</script>

<template>
  <div
    class="app-shell"
    :class="{ 'app-shell--guest': !session.isAuthenticated }"
  >
    <AppSidebar v-if="session.isAuthenticated" />

    <div class="app-body">
      <AppTopbar @error="error = $event" />

      <main :class="session.isAuthenticated ? 'main-content' : 'guest-content'">
        <p
          v-if="error"
          class="error-message"
          role="alert"
        >
          {{ error }}
        </p>
        <router-view />
      </main>
    </div>
  </div>
</template>
