import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    queue: [],
    show: false,
    message: '',
    color: 'success',
    icon: '',
    timeout: 3000,
    isLoading: false,
    startedAt: 0,
  }),

  actions: {
    _enqueue(toast) {
      this.queue.push(toast)
      if (!this.show) {
        this._dequeue()
      }
    },

    _dequeue() {
      if (this.queue.length === 0) {
        this.show = false
        return
      }

      const next = this.queue.shift()
      this.message = next.message
      this.color = next.color
      this.icon = next.icon
      this.timeout = next.timeout
      this.isLoading = next.isLoading || false
      this.startedAt = Date.now()
      this.show = true
    },

    success(message, timeout = 2000) {
      this._enqueue({ message, color: 'success', icon: 'mdi-check-circle', timeout })
    },

    error(message, timeout = 4000) {
      this._enqueue({ message, color: 'error', icon: 'mdi-alert-circle', timeout })
    },

    info(message, timeout = 3000) {
      this._enqueue({ message, color: 'info', icon: 'mdi-information', timeout })
    },

    loading(message = 'Loading...') {
      this._enqueue({
        message,
        color: 'primary',
        icon: 'mdi-loading',
        timeout: -1, // infinite
        isLoading: true,
      })
    },

    clearLoading() {
      this.isLoading = false
      this.show = false
      this._dequeue()
    },
  },
})
