<template>
  <v-snackbar
    v-model="toast.show"
    :timeout="toast.timeout"
    location="top end"
    elevation="4"
    rounded="lg"
    class="toast-snackbar"
    @update:model-value="onClose"
  >
    <div class="toast-content">
      <!-- Icon (FIXED) -->
      <v-icon
        v-if="toast.icon"
        :color="toast.color"
        size="20"
        class="mr-2"
      >
        {{ toast.icon }}
      </v-icon>

      <!-- Message -->
      <span class="toast-message">
        {{ toast.message }}
      </span>

      <!-- Close -->
      <v-btn
        icon
        size="x-small"
        variant="text"
        v-if="!toast.isLoading"
        @click="toast.show = false"
      >
        <v-icon size="16">mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Progress bar (FIXED + SMALLER) -->
    <div
      v-if="toast.timeout > 0"
      :key="toast.startedAt"
      class="toast-progress"
      :class="toast.color"
      :style="{ animationDuration: toast.timeout + 'ms' }"
    />
  </v-snackbar>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

function onClose(val) {
  if (!val && !toast.isLoading) {
    toast._dequeue()
  }
}
</script>

<style scoped>
.toast-snackbar {
  min-width: 280px;
  padding: 6px 10px;
}

/* Content row */
.toast-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

/* Progress bar */
.toast-progress {
  height: 3px;
  width: 100%;
  margin-top: 6px;
  border-radius: 0 0 8px 8px;
  transform-origin: left;
  animation-name: shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.toast-progress.success { background-color: #4caf50; }
.toast-progress.error   { background-color: #f44336; }
.toast-progress.info    { background-color: #2196f3; }

@keyframes shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
</style>
