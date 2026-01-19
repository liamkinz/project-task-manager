<!-- src/components/AppLayout.vue -->
<template>
<v-app>
    <v-layout>
        <v-navigation-drawer class="bg-primary" location="right"
         permanent>
            <!-- Navigation items go here -->
            <v-list nav>
                <v-list-item title="Tasks" prepend-icon="mdi-check-circle" to="/tasks" />
                <v-list-item title="Profile" prepend-icon="mdi-account" to="/profile" />
                <v-divider class="my-4" />
                <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout" />
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="primary" dark>
        <v-toolbar-title>My Dashboard</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-layout>
</v-app>
</template>

<script setup>
    import { supabase } from '../lib/supabase'

    async function logout() {
        await supabase.auth.signOut()
        // Optionally, redirect to login page
        // optional: reload page after logout
    window.location.reload()
    }
</script>