<!-- src/components/AppLayout.vue -->
<template>
<v-app>
    <v-layout>
        <v-navigation-drawer expand-on-hover color="#333e52" width="200" permanent rail>
            <!-- Navigation items go here -->
            <v-list nav>
                <v-list-item title="Tasks" prepend-icon="mdi-check-circle" to="/tasks" />
                
                <v-divider class="my-4" />

                <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout" />
            </v-list>
        </v-navigation-drawer>

        <!-- App Bar -->
        <v-app-bar color="primary" dark>
            <v-toolbar-title>My Dashboard</v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="toggleTheme">
                    <v-icon>
                        {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }} //mdi-moon-waning-crescent
                    </v-icon>   
                </v-btn>
                
                <v-menu v-if="user">
                    <template #activator="{ props }">
                        <v-btn icon v-bind="props">
                            <v-avatar size="40">
                                <v-img v-if="avatarUrl" :src="avatarUrl" cover />
                                <span v-else class="text-white">
                                    {{  userInitial }}
                                </span>
                            </v-avatar>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item 
                        :title="user.email"
                        subtitle="View Profile"
                        prepend-icon="mdi-account"
                        to="/profile"
                        />

                        <v-list-item
                        title="Settings"
                        prepend-icon="mdi-cog"
                        to="/settings"
                        />

                        <v-divider />

                        <v-list-item 
                        title="Logout"
                        prepend-icon="mdi-logout"
                        @click="logout"
                        />

                    </v-list>
                </v-menu>
                <!-- <v-list-item class="mx-4" title="Profile" prepend-icon="mdi-account" to="/profile" /> -->
        </v-app-bar>

         <!-- Main Content -->
        <v-main>
            <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-layout>
</v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { supabase } from '../lib/supabase'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()


const theme = useTheme()
const user = ref(null)
const avatarUrl = computed(() => profileStore.avatarUrl)

const userInitial = computed(() =>
    user.value?.email?.charAt(0).toUpperCase()
    )

    onMounted(async () => {
        // 1️⃣ Get authenticated user
        const { data: auth } = await supabase.auth.getUser()
        user.value = auth.user

        // 2️⃣ Restore theme (unchanged)
        const saved = localStorage.getItem('theme')
        if (saved) theme.change(saved)

        // 3️⃣ Load avatar into Pinia store
        if (user.value) {
            await profileStore.fetchAvatar(user.value.id)
    }
    })


    // async function fetchAvatar () {
    // try {
    //     const { data, error } = supabase.storage
    //     .from('avatars')
    //     .getPublicUrl(`${user.value.id}.png`)

    //     if (error) {
    //     console.warn('Avatar not found')
    //     avatarUrl.value = null
    //     return
    //     }

    //     avatarUrl.value = data.publicUrl
    //     } catch (err) {
    //         console.error('Failed to fetch avatar:', err)
    //         avatarUrl.value = null
    //     }
    // }

    async function fetchProfile () {
        if (!user.value) return
        // 1️⃣ Get avatar path from DB
        const { data, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.value.id)
            .single()

            console.log('PROFILE ROW', data)
        if (error || !data?.avatar_url) {
            avatarUrl.value = null
            return
        }

        // 2️⃣ Convert PATH → PUBLIC URL
        const { data: storage } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url)

        // 3️⃣ Cache-busting so updates show immediately
        avatarUrl.value = `${storage.publicUrl}?t=${Date.now()}`
        console.log('PUBLIC URL:', avatarUrl.value)
        console.log('AppLayout received avatar-updated')
    }

    function toggleTheme () {
        const isDark = theme.global.current.value.dark
        theme.change(isDark ? 'light' : 'dark')
    }

    async function logout() {
        await supabase.auth.signOut()
        // Optionally, redirect to login page
        // optional: reload page after logout
    profileStore.clear()
    window.location.reload()
    }
</script>