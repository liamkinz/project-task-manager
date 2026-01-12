<!-- eslint-disable @stylistic/no-trailing-spaces -->
<template>
  <v-container class="pa-0">
    <v-row align="center" class="mb-8">
      <v-col>
        <h2 class="text-h4 font-weight-black">My Workspace</h2>
        <span class="grey--text text--darken-1">{{ tasks.length }} Tasks Remaining</span>
      </v-col>
      <v-spacer />
      <v-btn
        class="font-weight-bold"
        color="red darken-2"
        text
        x-large
        @click="logout"
      >
        <v-icon left>mdi-logout</v-icon> Logout
      </v-btn>
    </v-row>

    <v-card class="pa-8 mb-12 grey lighten-5" elevation="4" rounded="xl">
      <h3 class="text-h5 font-weight-bold mb-6">Create New Task</h3>
      <v-row>
        <v-col cols="12">
          <v-text-field 
            v-model="newTitle"  
            background-color="white"
            class="text-h6"
            filled
            label="What needs to be done?"
            placeholder="e.g. Design Landing Page"
            rounded
          />
        </v-col>
        <v-col class="mt-n4" cols="12">
          <v-textarea
            v-model="newDescription"
            background-color="white"
            filled
            label="Additional details (optional)"
            rounded
            rows="3"
          />
        </v-col>
      </v-row>
      <v-btn
        block
        class="text-h6 rounded-pill elevation-6"
        color="primary"
        x-large
        @click="addTask"
      >
        <v-icon left size="28">mdi-plus</v-icon> Add Task to List
      </v-btn>
    </v-card>

    <v-row>
      <v-col v-for="task in tasks" :key="task.id" cols="12">
        <v-card 
          class="pa-6 mb-4 transition-swing" 
          elevation="2" 
          hover 
          rounded="lg"
          style="border-left: 8px solid #1976D2"
        >
          <v-row align="center">
            <v-col v-if="editingTaskId !== task.id">
              <div class="text-h5 font-weight-bold mb-1">{{ task.title }}</div>
              <div class="text-subtitle-1 grey--text text--darken-2">{{ task.description }}</div>
            </v-col>

            <v-col cols="auto">
              <v-btn
                class="blue--text text-none font-weight-bold"
                color="blue lighten-5"
                depressed
                large
                rounded
                @click="openDialog(task)"
              >
                <v-icon left>mdi-open-in-new</v-icon> Open Details
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogOpen" max-width="800" overlay-opacity="0.8">
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
          <v-btn
            class="font-weight-bold"
            color="error"
            text
            x-large
            @click="deleteFromDialog"
          >
            <v-icon left>mdi-delete</v-icon> Delete
          </v-btn>
          <v-spacer />
          <v-btn
            class="mr-2"
            color="grey lighten-2"
            text
            x-large
            @click="closeDialog"
          >Cancel</v-btn>
          <v-btn class="px-10 elevation-4 rounded-pill" color="success" x-large @click="updateFromDialog">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { supabase } from '../lib/supabase'
  /* STATE */
  const tasks = ref([])

  const newTitle = ref('')
  const newDescription = ref('')

  const editingTaskId = ref(null)
  const editedTitle = ref('')
  const editedDescription = ref('')

  /* DIALOG STATE */
  const dialogOpen = ref(false)
  const selectedTask = ref(null)

  function openDialog (task) {
    selectedTask.value = task
    editedTitle.value = task.title
    editedDescription.value = task.description
    dialogOpen.value = true
  }

  function closeDialog () {
    dialogOpen.value = false
    selectedTask.value = null
  }

  async function updateFromDialog () {
    if (!selectedTask.value) return
    await updateTask(selectedTask.value.id)
    closeDialog()
  }

  async function deleteFromDialog () {
    if (!selectedTask.value) return
    await deleteTask(selectedTask.value.id)
    closeDialog()
  }

  /* READ */
  async function fetchTasks () {
    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    tasks.value = data
  }

  /* CREATE */
  async function addTask () {
    if (!newTitle.value) return

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('tasks').insert({
      user_id: user.id,
      title: newTitle.value,
      description: newDescription.value,
    })

    newTitle.value = ''
    newDescription.value = ''
    fetchTasks()
  }

  /* DELETE */
  async function deleteTask (id) {
    await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    fetchTasks()
  }

  /* UPDATE */
  async function updateTask (id) {
    if (!editedTitle.value) return

    await supabase
      .from('tasks')
      .update({
        title: editedTitle.value,
        description: editedDescription.value,
      })
      .eq('id', id)

    editingTaskId.value = null
    editedTitle.value = ''
    editedDescription.value = ''
    fetchTasks()
  }

  /* LOGOUT */
  async function logout () {
    await supabase.auth.signOut()
  }

  onMounted(fetchTasks)
</script>
