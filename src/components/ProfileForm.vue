<!-- src/components/ProfileForm.vue -->
<template>
    <v-card class="pa-6" elevation="4" max-width="600">
        <v-card-title>Profile Information</v-card-title>
        
        <v-row class="ma-2" align="center">
            <v-avatar size="96">
                <v-img v-if="avatarUrl" :src="avatarUrl" />
                <v-icon v-else size="48">mdi-account</v-icon>
            </v-avatar>
        
        <v-file-input
        class="ml-4"
        label="Upload avatar"
        accept="image/*"
        prepend-icon="mdi-camera"
        :loading="uploading"
        density="compact"
        @update:model-value="uploadAvatar"
        />
        </v-row>

        <v-form @submit.prevent="saveProfile">
            <!-- Email is NOT in profile, so it should be readonly or removed -->
            <v-text-field
                label="Email"
                :model-value="props.user?.email"
                readonly
                type="email"
            />
            <v-text-field label="Full Name" v-model="profile.name" required />
            <v-textarea label="Bio" v-model="profile.bio" rows="3" />
            <v-text-field label="Job Title" v-model="profile.job" />

            <v-btn type="submit" color="secondary" class="mt-4" :loading="loading">
                Save Profile
            </v-btn>
        </v-form>
    </v-card>
</template>

<script setup>
    import { reactive, ref, watch, computed } from 'vue'
    import { supabase } from '@/lib/supabase'
    import { useProfileStore } from '@/stores/profile'
    import { useToastStore } from '@/stores/toast'

    const profileStore = useProfileStore()
    const toast = useToastStore()

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
    })

    const profile = reactive({
        name: '',
        bio: '',
        job: '',
        avatar_url: null, // stores PATH ONLY
    })  
    const loading = ref(false)
    const uploading = ref(false)
    let hasLoaded = false

    // --------------------
    // Load profile
    // --------------------
    async function loadProfile() {
        if (!props.user || hasLoaded) return
        hasLoaded = true
        
        const { data, error } = await supabase
            .from('profiles')
            .select('name, bio, job, avatar_url')
            .eq('id', props.user.id)
            .single()
        
        if (!error && data) {
            profile.name = data.name || ''
            profile.bio = data.bio || ''
            profile.job = data.job || ''
            profile.avatar_url = data.avatar_url || ''
        }
    }

watch(
  () => props.user.id,
  () => {
    hasLoaded = false
    loadProfile()
  },
  { immediate: true }
)

    // --------------------
    // Avatar PUBLIC URL (SAFE)
    // --------------------
    const avatarUrl = computed(() => {
            if (!profile.avatar_url) return null

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(profile.avatar_url)

            return data.publicUrl
        })

    const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl('f7bc5fb2-23fe-4c62-bca7-be7edf7408b5/avatar.jpg')

    console.log(data.publicUrl)

    // --------------------
    // Upload Avatar
    // --------------------
    async function uploadAvatar(files) {

    if (loading.value) return // 🚫 double submit protection

        // IMPORTANT REMINDER TO SET AVATAR IN PROFILE SET THIS IN SQL EDITOR:
        // update profiles
        // set avatar_url = 'avatars/f7bc5fb2-23fe-4c62-bca7-be7edf7408b5/avatar.jpg'
        // where id = 'f7bc5fb2-23fe-4c62-bca7-be7edf7408b5';

    if (!files || !props.user) return

    const file = Array.isArray(files) ? files[0] : files
    if (!(file instanceof File)) return

    const fileExt = file.name.split('.').pop().toLowerCase()
    //   const filePath = `${props.user.id}/avatar.${fileExt}`
    const filePath = `${props.user.id}/avatar-${Date.now()}.${fileExt}`

    uploading.value = true

    try {
        // 1️⃣ Upload (overwrite old avatar)
        const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            upsert: true,
            cacheControl: '3600',
        })

        if (uploadError) throw uploadError

        // 2️⃣ Save PATH to DB (NOT URL)
        const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', props.user.id)

        if (updateError) throw updateError

        // 3️⃣ Update local state
        profile.avatar_url = filePath
        profileStore.updateAvatarPath(filePath)
        
        
        toast.clearLoading()
        toast.success('Avatar uploaded successfully!')
    } catch (err) {
        console.error('Avatar upload failed:', err)
        toast.clearLoading()
        toast.error('Failed to upload avatar.')
    } finally {
        uploading.value = false
    }
    }
    // --------------------
    // Save Profile
    // --------------------
    async function saveProfile(){
        if (loading.value) return // 🚫 double submit protection

        loading.value = true
        toast.loading('Saving profile...')
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: props.user.id,
                    email: props.user.email,
                    name: profile.name,
                    bio: profile.bio,
                    job: profile.job,
                    avatar_url: profile.avatar_url,
                    updated_at: new Date()
                })

            if (error) {
                throw error
            }
            toast.clearLoading()
            toast.success('Profile saved successfully!')
        } catch (err) {
            console.error('Failed to save profile:', err)
            toast.clearLoading()
            toast.error('Failed to save profile.')
        }
        finally {
            loading.value = false
        }
    }

</script>