<!-- eslint-disable @stylistic/no-trailing-spaces -->
<template>
<AppLayout>
  <v-container class="pa-0">
    <v-row align="center" class="mb-8">
      <v-col>
        <h2 class="text-h4 font-weight-black">My Workspace</h2>
        <span class="grey--text text--darken-1">{{ tasks.length }} Tasks Remaining</span>
      </v-col>
      <v-spacer />
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
        class="px-6 font-weight-bold"
        color="primary"
        elevation="2"
        rounded="pill"
        size="large"
        @click="addTask"
      >
        <v-icon left size="28">mdi-plus</v-icon>Add Task to List
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

            <v-col
              class="d-flex justify-end"
              cols="6"
              lg="4"
              md="6"
              xl="3"
            >
              <TaskTimer
                :initial-minutes="5" 
                @finished="onTimerFinished"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <TaskDialog
      v-model="dialogOpen"
      :selectedTask="selectedTask"
      @save="updateFromDialog"
      @delete="deleteFromDialog"
      @close="closeDialog"
    />

  </v-container>
  </AppLayout>
</template>

<script setup>
  import AppLayout from './AppLayout.vue'
  import { onMounted, ref } from 'vue'
  import TaskDialog from '../dialogs/TaskDialog.vue'
  import { supabase } from '../lib/supabase'

  defineProps({ user: Object })
  
  /* STATE */
  const tasks = ref([])

  const newTitle = ref('')
  const newDescription = ref('')

  const editingTaskId = ref(null)

  /* DIALOG STATE */
  const dialogOpen = ref(false)
  const selectedTask = ref(null)

  function openDialog (task) {
    selectedTask.value = task
    dialogOpen.value = true
  }

  function closeDialog () {
    dialogOpen.value = false
    selectedTask.value = null
  }

  function onTimerFinished () {
    console.log('Timer completed!')
  }

  async function updateFromDialog (payload) {
    if (!payload) return
    await updateTask(payload.id, payload.title, payload.description)
    closeDialog()
  }

  async function deleteFromDialog (id) {
    if (!id) return
    await deleteTask(id)
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
  async function updateTask (id, title, description) {
    if (!title) return

    await supabase
      .from('tasks')
      .update({
        title,
        description,
      })
      .eq('id', id)

    editingTaskId.value = null
    fetchTasks()
  }

  /* LOGOUT */
  async function logout () {
    await supabase.auth.signOut()
  }

  onMounted(fetchTasks)
</script>
