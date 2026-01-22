import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    avatarPath: null, // e.g. userId/avatar.jpg
    avatarUrl: null,  // full public URL
    loading: false,
  }),

  actions: {
    async fetchAvatar (userId) {
      if (!userId) return

      this.loading = true

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single()

      if (error || !data?.avatar_url) {
        this.avatarPath = null
        this.avatarUrl = null
        this.loading = false
        return
      }

      this.avatarPath = data.avatar_url

      const { data: storage } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.avatar_url)

      // cache-busting so updates show immediately
      this.avatarUrl = `${storage.publicUrl}?t=${Date.now()}`
      this.loading = false
    },

    updateAvatarPath (path) {
      if (!path) return

      this.avatarPath = path

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      this.avatarUrl = `${data.publicUrl}?t=${Date.now()}`
    },

    clear () {
      this.avatarPath = null
      this.avatarUrl = null
    },
  },
})
