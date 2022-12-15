<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { taskService } from '../services/task.service'

const taskToEdit = ref(taskService.getEmptyTask())
const route = useRoute()

onMounted(async () => {
  const taskId = route.params.id
  if (taskId) taskToEdit.value = await taskService.getTask(taskId)
})

const errorsOptions = computed(() => {
  return [
    'Error 1',
    'Error 2',
    'Error 3',
    'Error 4'
  ]
})

function saveTask() {
  console.log('TODO: Save')
}
</script>

<template>

  <main class="task-edit">
    <h1>Task edit</h1>

    <el-form :model="taskToEdit" label-width="100">

      <el-form-item label="Title">
        <el-input v-model="taskToEdit.title" placeholder="Type a title.." />
      </el-form-item>

      <el-form-item label="Status">
        <el-input v-model="taskToEdit.status" placeholder="Choose a status" />
      </el-form-item>

      <el-form-item label="Description">
        <el-input v-model="taskToEdit.description" placeholder="Type a description" />
      </el-form-item>

      <el-form-item label="Importance">
        <el-input v-model="taskToEdit.importance" type="number" />
      </el-form-item>

      <el-form-item label="Tries count">
        <el-input v-model="taskToEdit.triesCount" type="number" />
      </el-form-item>

      <el-form-item label="Tries count">
        <el-select v-model="taskToEdit.errors" placeholder="Select errors" multiple>
          <el-option v-for="error in errorsOptions"
            :key="error"
            :label="error"
            :value="error" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveTask()">Save</el-button>
      </el-form-item>

    </el-form>
  </main>

</template>
