<template>
  <v-app>
    <v-main class="fill-height">
      <LoginView v-if="!user" />
      <Tasks v-else :user="user" />
    </v-main>
  </v-app>
</template>
<!-- <template>
  <v-app>
    <v-main class="animated-background">
      <v-container class="fill-height" fluid>

        <v-row align="center" justify="center">
          <v-col
            cols="12"
            lg="8"
            md="10"
            sm="10"
            xl="6"
          >

            <v-card
              class="rounded-xl overflow-hidden"
              elevation="10"
              min-height="70vh"
            >
              <v-row no-gutters style="height: 100%; min-height: 70vh;">

                <v-col cols="12">
                  <v-fade-transition mode="out-in">

                    <div
                      v-if="!user"
                      key="auth"
                      class="d-flex flex-column justify-center align-center h-100 pa-10"
                    >
                      <div class="text-center mb-8">
                        <v-avatar class="mb-6" color="primary-lighten-5" size="120">
                          <v-icon color="primary" size="60">mdi-lock-open-outline</v-icon>
                        </v-avatar>

                        <h1 class="text-h3 font-weight-bold text-primary mb-2">Welcome Back</h1>

                        <p class="text-subtitle-1 text-grey-darken-1">
                          Enter your credentials to access your workspace
                        </p>
                      </div>

                      <v-card flat max-width="450" width="100%">
                        <Auth />
                      </v-card>
                    </div>

                    <div v-else key="tasks" class="d-flex flex-column h-100">

                      <v-divider />

                      <div class="pa-8 flex-grow-1 bg-grey-lighten-5 scroll-container">
                        <div class="tasks-wrapper mx-auto" style="max-width: 800px;">
                          <Tasks />
                        </div>
                      </div>
                    </div>

                  </v-fade-transition>
                </v-col>
              </v-row>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template> -->

<!-- <script setup>
  import { onMounted, ref } from 'vue'
  import Auth from './components/Auth.vue'
  import LoginView from './components/LoginView.vue'
  import Tasks from './components/Tasks.vue'
  import { supabase } from './lib/supabase'

  const user = ref(null)

  onMounted(() => {
    supabase.auth.getUser().then(({ data }) => {
      user.value = data.user
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  })
</script> -->

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import LoginView from './components/LoginView.vue'
  import Tasks from './components/Tasks.vue'
  import { supabase } from './lib/supabase'

  const user = ref(null)
  let subscription = null

  onMounted(async () => {
    // Get existing session (important on refresh)
    const { data } = await supabase.auth.getUser()
    user.value = data.user

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        user.value = session?.user ?? null
      },
    )

    subscription = listener.subscription
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
  })
</script>

<!-- <style scoped>
/* Ensuring the internal components stretch to fill the card */
.v-card {
  display: flex;
  flex-direction: column;
}
</style> -->

<!-- <style scoped>
.app-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.95);
}
</style> -->

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
