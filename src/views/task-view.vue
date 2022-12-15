<script setup>
import { ref, onMounted, computed } from 'vue'

import { taskService } from '../services/task.service'
import taskActions from '../components/task-actions.vue'

const tasks = ref([])
const isTaskWorkerRunning = ref(true)
const workerBtnTxt = computed(() => isTaskWorkerRunning.value ? 'Stop' : 'Start')

onMounted(async () => {
  tasks.value = await taskService.getTasks()
})

function generateTasks() {
  tasks.value.push(
    ...taskService.generateTasks(10)
  )
}

async function clearTasks() {
  // await taskService.deleteAllTasks()
  tasks.value = []
}

function generateNewTask() {
  tasks.value.push(taskService.generateTask())
}

async function toggleTaskWorker() {
  // await taskService.startWorker()
  isTaskWorkerRunning.value = !isTaskWorkerRunning.value
}

async function handleDeleteTask(taskId) {
  const idx = tasks.value.findIndex(({ _id }) => _id === taskId)
  if (idx === -1) return

  // await taskService.deleteTask(taskId)
  tasks.value.splice(idx, 1)
}

</script>

<template>

  <main>
    <h1>Mister tasker</h1>

    <section class="table-actions">
      <el-button type="primary" @click="generateTasks">Generate tasks</el-button>
      <el-button type="danger" @click="clearTasks">Clear tasks</el-button>
      <el-button type="success" @click="generateNewTask">Generate new task</el-button>
      <el-button
        :type="isTaskWorkerRunning ? 'warning' : 'success'"
        @click="toggleTaskWorker">
        {{ workerBtnTxt }} service worker
      </el-button>
    </section>

    <el-table :data="tasks">

      <el-table-column prop="title" label="Title" min-width="300" />

      <el-table-column prop="importance" label="Importance" sortable min-width="100" />

      <el-table-column prop="status" label="Status" min-width="70" />

      <el-table-column prop="triesCount" label="Tries count" min-width="120" sortable />

      <el-table-column label="Actions" min-width="200" align="center">
        <template #default="scope">
          <task-actions :task="scope.row"
          @delete="handleDeleteTask"
          />
        </template>
      </el-table-column>

    </el-table>
  </main>

</template>
