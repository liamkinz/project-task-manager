<template>
     <v-dialog v-model="dialogOpen" max-width="500" overlay-opacity="0.8">
      <v-card class="pa-6" rounded="xl">
        <v-card-title class="text-h4 font-weight-bold pb-4">
          Task Settings
        </v-card-title>
        <v-divider class="mb-6" />

        <v-card-text>
          <div v-if="selectedTask">
            <v-text-field 
              v-model="editedTitle" 
              class="text-h5" 
              label="Task Title" 
              outlined
            />
            <v-textarea 
              v-model="editedDescription" 
              class="text-body-1" 
              label="Description" 
              outlined 
              rows="6"
            />
          </div>
        </v-card-text>

        <v-card-actions class="pb-6 px-6">
          <v-btn class="px-10 elevation-4 rounded-pill" color="success" x-large @click="updateFromDialog">
            Save Changes
          </v-btn>
          <v-btn
            class="mr-2"
            color="grey lighten-2"
            text
            x-large
            @click="closeDialog"
          >Cancel</v-btn>
          <v-spacer />  
          <v-btn
            class="font-weight-bold"
            color="error"
            text
            x-large
            @click="deleteFromDialog"
          >
            <v-icon left>mdi-delete</v-icon> Delete
          </v-btn>    
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  selectedTask: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'save', 'delete', 'close'])

const editedTitle = ref('')
const editedDescription = ref('')

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

watch(
  () => props.selectedTask,
  (task) => {
    if (task) {
      editedTitle.value = task.title || ''
      editedDescription.value = task.description || ''
    } else {
      editedTitle.value = ''
      editedDescription.value = ''
    }
  },
  { immediate: true }
)

function closeDialog () {
  emit('update:modelValue', false)
  emit('close')
}

function updateFromDialog () {
  if (!props.selectedTask) return
  emit('save', {
    id: props.selectedTask.id,
    title: editedTitle.value,
    description: editedDescription.value,
  })
}

function deleteFromDialog () {
  if (!props.selectedTask) return
  emit('delete', props.selectedTask.id)
  emit('update:modelValue', false)
}
</script>

<style scoped>

</style>