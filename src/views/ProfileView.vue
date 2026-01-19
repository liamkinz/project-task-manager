<!-- src/views/ProfileView.vue -->
<template>
    <AppLayout>
        <ProfileForm :user="user" />
    </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import ProfileForm from '@/components/ProfileForm.vue'
import { de } from 'vuetify/locale';

defineProps({ user: Object })
</script>