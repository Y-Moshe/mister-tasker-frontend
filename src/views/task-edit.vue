<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { taskService } from '../services/task.service'

const taskToEdit = ref(taskService.getEmptyTask())
const route = useRoute()

onMounted(async () => {
  const taskId = route.params.id
  if (taskId) taskToEdit = await taskService.getTask(taskId)
})
</script>

<template>

  <main class="task-edit">

  </main>

</template>
