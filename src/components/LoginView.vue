<template>
  <v-container class="login-root pa-0" fluid>
    <v-row class="fill-height" no-gutters>

      <!-- LEFT PANEL -->
      <v-col
        class="login-panel d-flex align-center justify-center"
        cols="12"
        md="5"
      >
        <div class="login-content">

          <!-- Header -->
          <div class="text-center mb-8">
            <v-icon color="primary" size="48">mdi-triangle</v-icon>
            <h1 class="text-h4 font-weight-bold mt-4">
              {{ isRegister ? 'Create account' : 'Welcome back!' }}
            </h1>
            <p class="text-grey-lighten-1 mt-1">
              {{ isRegister
                ? 'Sign up to get started'
                : 'Log into your account'
              }}
            </p>
          </div>

          <!-- FORM -->
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              class="mb-4"
              density="comfortable"
              :disabled="loading"
              hide-details
              label="Email"
              variant="outlined"
            />

            <v-text-field
              v-model="password"
              density="comfortable"
              :disabled="loading"
              hide-details
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
            >
              <template #append-inner>
                <v-icon
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>

            <!-- Error -->
            <p v-if="error" class="text-red mt-2 text-caption">
              {{ error }}
            </p>

            <!-- Forgot -->
            <div
              v-if="!isRegister"
              class="text-right mt-2 mb-6"
            >
              <a class="link">Forgot password?</a>
            </div>

            <!-- Submit -->
            <v-btn
              block
              class="mb-4"
              color="#006D5B"
              :loading="loading"
              size="large"
              type="submit"
            >
              {{ isRegister ? 'Sign Up' : 'Log In' }}
            </v-btn>

            <!-- Toggle -->
            <v-btn
              block
              color="primary"
              variant="text"
              @click="isRegister = !isRegister"
            >
              {{ isRegister
                ? 'Already have an account? Log in'
                : 'Don’t have an account? Sign up'
              }}
            </v-btn>
          </v-form>

          <!-- Divider -->
          <div class="divider my-6">
            <span>Or continue with</span>
          </div>

          <!-- Social (UI only for now) -->
          <div class="d-flex justify-center gap-4">
            <v-btn icon variant="outlined">
              <v-icon color="red">mdi-google</v-icon>
            </v-btn>
            <v-btn icon variant="outlined">
              <v-icon color="blue">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="outlined">
              <v-icon>mdi-github</v-icon>
            </v-btn>
          </div>

        </div>
      </v-col>

      <!-- RIGHT IMAGE -->
      <v-col
        class="image-panel d-none d-md-flex"
        cols="0"
        md="7"
      />
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { id } from 'vuetify/locale'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isRegister = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit () {
  error.value = ''
  loading.value = true

  try {
    if (isRegister.value) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) throw signUpError

      // Create profile row
      if (data?.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name: '',
          bio: '',
          job: '',
          created_at: new Date(),
        })
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError
    }
  } catch (err) {
    error.value = err?.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-root {
  height: 100vh;
}

/* LEFT */
.login-panel {
  background: #1a2835;
  color: white;
}

.login-content {
  width: 100%;
  max-width: 380px;
}

/* LINKS */
.link {
  color: #2196f3;
  cursor: pointer;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

/* DIVIDER */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #9e9e9e;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #333;
}
.divider:not(:empty)::before {
  margin-right: 0.75em;
}
.divider:not(:empty)::after {
  margin-left: 0.75em;
}

/* RIGHT IMAGE */
.image-panel {
  background-image: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470');
  background-size: cover;
  background-position: center;
}
</style>
