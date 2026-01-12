<template>
  <v-app>
    <v-main class="grey lighten-3">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" lg="4" md="6" sm="8">

            <v-card class="pa-6" elevation="10" rounded="lg">
              <v-fade-transition mode="out-in">

                <div v-if="!user" key="auth">
                  <div class="text-center mb-6">
                    <v-icon color="primary" size="64">mdi-account-circle</v-icon>
                    <h2 class="text-h4 font-weight-bold mt-2">Welcome</h2>
                    <p class="grey--text">Please sign in to continue</p>
                  </div>
                  <Auth />
                </div>

                <div v-else key="tasks">
                  <Tasks />
                </div>

              </v-fade-transition>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import Auth from './components/Auth.vue'
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
</script>

<style scoped>
.app-frame {
  width: 800px;
  max-width: 95vw;
}
</style>
