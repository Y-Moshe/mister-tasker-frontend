<script setup>
import { ref, onMounted, computed } from 'vue'
import { capitalize } from 'lodash'

import { taskService } from '../services/task.service'
import taskActions from '../components/task-actions.vue'
import taskPreview from '../components/task-preview.vue'

const tasks = ref([])
const isTaskWorkerRunning = ref(true)
const workerBtnTxt = computed(() => isTaskWorkerRunning.value ? 'Stop' : 'Start')
const STATUS = taskService.STATUS

onMounted(async () => {
  tasks.value = await taskService.getTasks()
})

async function generateTasks(count) {
  const generatedTasks = await taskService.generateTasks(count)
  tasks.value.push(...generatedTasks)
}

async function clearTasks() {
  await taskService.deleteAllTasks()
  tasks.value = []
}

async function toggleTaskWorker() {
  // await taskService.startWorker()
  isTaskWorkerRunning.value = !isTaskWorkerRunning.value
}

async function handleStartTask(task) {
  task.status = STATUS.RUNNING
  const updatedTask = await taskService.performTask(task)

  const idx = tasks.value.findIndex(({ _id }) => _id === task._id)
  tasks.value[idx] = updatedTask
}

async function handleDeleteTask(taskId) {
  const idx = tasks.value.findIndex(({ _id }) => _id === taskId)
  if (idx === -1) return

  await taskService.deleteTask(taskId)
  tasks.value.splice(idx, 1)
}

function getStatusType(status) {
  switch (status) {
    case STATUS.DONE:
      return 'success'
    case STATUS.FAILED:
      return 'danger'
    case STATUS.RUNNING:
      return 'warning'
    default:
      return ''
  }
}

</script>

<template>

  <main>
    <h1>Mister tasker</h1>

    <section class="flex justify-content-between">
      <el-button type="primary" @click="generateTasks(10)">Generate tasks</el-button>
      <el-button type="danger" @click="clearTasks">Clear tasks</el-button>
      <el-button type="success" @click="generateTasks(1)">Generate new task</el-button>
      <el-button
        :type="isTaskWorkerRunning ? 'warning' : 'success'"
        @click="toggleTaskWorker">
        {{ workerBtnTxt }} service worker
      </el-button>
    </section>

    <el-table :data="tasks" height="800" style="width: 100%">

      <el-table-column type="expand">
        <template #default="scope">
          <task-preview :task="scope.row" @delete="handleDeleteTask" />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="Title" min-width="300" />

      <el-table-column prop="importance" label="Importance" sortable min-width="100" />

      <el-table-column prop="status" label="Status" min-width="70">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ capitalize(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="triesCount" label="Tries count" min-width="120" sortable />

      <el-table-column label="Actions" min-width="200" align="center">
        <template #default="scope">
          <task-actions :task="scope.row"
            @delete="handleDeleteTask"
            @start="handleStartTask"
            @retry="handleStartTask" />
        </template>
      </el-table-column>

    </el-table>
  </main>

</template>
