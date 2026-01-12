<template>
  <v-card class="pa-5" max-width="400">
    <v-text-field v-model="email" label="Email" />
    <v-text-field v-model="password" label="Password" type="password" />

    <v-btn color="primary" @click="register">Register</v-btn>
    <v-btn class="ml-2" color="secondary" @click="login">Login</v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { supabase } from '../lib/supabase'

  const email = ref('')
  const password = ref('')

  async function register () {
    await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
  }

  async function login () {
    await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
  }
</script>
