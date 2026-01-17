<template>
  <v-card class="pa-1" elevation="4" width="200">

    <!-- <v-card-title class="text-center text-subtitle-1 font-weight-medium pa-0">
      Task Timer
    </v-card-title> -->

    <!-- PILL TIMER -->
    <v-card-text class="mt-1 pa-0">
      <v-progress-linear
        class="pill-timer"
        :color="timerColor"
        height="25"
        :model-value="progressPercentage"
        rounded
      >
        <span class="text-white text-body-2 font-weight-bold">
          {{ formattedTime }}
        </span>
      </v-progress-linear>
    </v-card-text>

    <!-- ACTIONS -->
    <v-card-actions class="justify-center mt-1 pa-0">
      <!-- Play/Pause Button -->
      <v-hover v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          :color="isRunning ? 'warning' : 'secondary'"
          size="small"
          :variant="isHovering ? 'elevated' : 'tonal'"
          @click="toggleTimer"
        >
          {{ isRunning ? 'Pause' : 'Start' }}
        </v-btn>
      </v-hover>

      <!-- Reset Button -->
      <v-hover v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          class="ml-1"
          color="primary"
          size="small"
          :variant="isHovering ? 'elevated' : 'tonal'"
          @click="resetTimer"
        >
          Reset
        </v-btn>
      </v-hover>

      <!-- Set Button -->
      <v-hover v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props"
          class="ml-1"
          color="info"
          size="small"
          :variant="isHovering ? 'elevated' : 'outlined'"
          @click="dialog = true"
        >
          Set
        </v-btn>
      </v-hover>
    </v-card-actions>

    <!-- SET TIME MODAL -->
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="text-subtitle-1">
          Set Time
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model.number="inputHours"
                density="compact"
                label="Hrs"
                min="0"
                type="number"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model.number="inputMinutes"
                density="compact"
                label="Min"
                max="59"
                min="0"
                type="number"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn size="small" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" size="small" variant="elevated" @click="applyTime">
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script setup>
  import { computed, onUnmounted, ref, watch } from 'vue'

  const props = defineProps({
    initialMinutes: {
      type: Number,
      default: 25,
    },
  })

  const emit = defineEmits(['finished'])

  const totalSeconds = ref(props.initialMinutes * 60)
  const timeLeft = ref(totalSeconds.value)
  const isRunning = ref(false)
  let intervalId = null

  const dialog = ref(false)
  const inputHours = ref(0)
  const inputMinutes = ref(props.initialMinutes)

  const formattedTime = computed(() => {
    const h = Math.floor(timeLeft.value / 3600)
    const m = Math.floor((timeLeft.value % 3600) / 60)
    const s = timeLeft.value % 60

    return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const progressPercentage = computed(() =>
    (timeLeft.value / totalSeconds.value) * 100,
  )

  const timerColor = computed(() => {
    if (timeLeft.value <= 10) return 'error'
    if (timeLeft.value <= totalSeconds.value / 2) return 'warning'
    return 'primary'
  })

  function startTimer () {
    if (isRunning.value || intervalId) return

    isRunning.value = true
    intervalId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        finishTimer()
      }
    }, 1000)
  }

  function pauseTimer () {
    isRunning.value = false
    clearInterval(intervalId)
    intervalId = null
  }

  function toggleTimer () {
    isRunning.value ? pauseTimer() : startTimer()
  }

  function resetTimer () {
    pauseTimer()
    timeLeft.value = totalSeconds.value
  }

  function finishTimer () {
    pauseTimer()
    emit('finished')
  }

  function applyTime () {
    const seconds
      = inputHours.value * 3600
        + inputMinutes.value * 60

    if (seconds <= 0) return

    pauseTimer()
    totalSeconds.value = seconds
    timeLeft.value = seconds
    dialog.value = false
  }

  watch(
    () => props.initialMinutes,
    val => {
      totalSeconds.value = val * 60
      resetTimer()
    },
  )

  onUnmounted(() => {
    clearInterval(intervalId)
  })
</script>

<style scoped>
.pill-timer {
  border-radius: 999px;
}
</style>
