<template>
  <v-app>
    <v-main class="fill-height">
      <LoginView v-if="!user" />
      <router-view v-else :user="user" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LoginView from './components/LoginView.vue'
import { supabase } from './lib/supabase'

const user = ref(null)
let subscription = null

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => { user.value = session?.user ?? null }
  )

  subscription = listener.subscription
})

onUnmounted(() => { subscription?.unsubscribe() })
</script>

<style scoped>
/* A modern, subtle gradient background */
.animated-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Custom scrollbar for the task list if it gets long */
.scroll-container {
  overflow-y: auto;
  max-height: calc(80vh - 100px);
}

/* Helper to make the header pop slightly */
.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
</style>
