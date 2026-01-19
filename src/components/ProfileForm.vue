<!-- src/components/ProfileForm.vue -->
<template>
    <v-card class="pa-6" elevation="4" max-width="600">
        <v-card-title>Profile Information</v-card-title>
        <v-form @submit.prevent="saveProfile">
            <v-text-field label="Full Name" v-model="name" required />
            <v-text-field label="Email" v-model="email" required type="email" />
            <v-textarea label="Bio" v-model="bio" rows="3" />
            <v-text-field label="Job Title" v-model="job" />

            <v-btn type="submit" color="primary" class="mt-4" :loading="loading">
                Save Profile
            </v-btn>
        </v-form>
    </v-card>
</template>

<script setup>
    import { reactive, ref, onMounted } from 'vue'
    import { supabase } from '@/lib/supabase'

    const props = defineProps({ user: Object })

    const profile = reactive({
        name: '',
        bio: '',
        job: ''
    })  
    const loading = ref(false)

    async function loadProfile() {
        if (!props.user) return
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', props.user.id)
            .single()
        
        if (error) {
            console.error('Error loading profile:', error)
        } else if (data) {
            profile.name = data.name || ''
            profile.bio = data.bio || ''
            profile.job = data.job || ''
        }
    }

onMounted(loadProfile)

async function saveProfile(){
    loading.value = true
    await supabase
        .from('profiles')
        .upsert({
            id: props.user.id,
            name: profile.name,
            bio: profile.bio,
            job: profile.job
        })
        error => {
            if (error) {
                console.error('Error saving profile:', error)
            } else {
                console.log('Profile saved successfully')
            }
        }
    loading.value = false
}
</script>