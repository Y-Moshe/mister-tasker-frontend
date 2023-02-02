<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { capitalize, debounce } from 'lodash'

import { taskService } from '../services/task.service'
import {
  socketService,
  SOCKET_EVENT_WORKER_TASK_ENDED,
  SOCKET_EVENT_WORKER_TASK_STARTED
} from '../services/socket.service'

import taskActions from '../components/task-actions.vue'
import taskPreview from '../components/task-preview.vue'

const tasks = ref([])
const searchForm = ref({ txt: '' })
const isTaskWorkerRunning = ref(true)
const workerBtnTxt = computed(() => isTaskWorkerRunning.value ? 'Stop' : 'Start')
const STATUS = taskService.STATUS

onMounted(async () => {
  tasks.value = await taskService.getTasks()

  socketService.on(SOCKET_EVENT_WORKER_TASK_STARTED, updateTask)
  socketService.on(SOCKET_EVENT_WORKER_TASK_ENDED, updateTask)
})

onUnmounted(() => {
  socketService.off(SOCKET_EVENT_WORKER_TASK_STARTED)
  socketService.off(SOCKET_EVENT_WORKER_TASK_ENDED)
})

function updateTask(task) {
  const idx = tasks.value.findIndex(({ _id }) => _id === task._id)
  tasks.value[idx] = task
}

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
  const { isWorkerOn } = await taskService.toggleTaskWorker()
  isTaskWorkerRunning.value = isWorkerOn
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

const handleSearch = debounce(async () => {
  const filterBy = {
    text: searchForm.value.txt
  }
  tasks.value = await taskService.getTasks(filterBy)
}, 500)

</script>

<template>

  <main>
    <h1>Mister tasker</h1>

    <section class="flex justify-content-between">
      <router-link to="/task/edit">
        <el-button type="primary" link>Add task</el-button>
      </router-link>
      <el-button type="success" @click="generateTasks(1)">Generate new task</el-button>
      <el-button type="primary" @click="generateTasks(10)">Generate tasks</el-button>
      <el-button type="danger" @click="clearTasks">Clear tasks</el-button>
      <el-button
        :type="isTaskWorkerRunning ? 'warning' : 'success'"
        @click="toggleTaskWorker">
        {{ workerBtnTxt }} service worker
      </el-button>
    </section>
    
    <el-form style="margin: 15px;">
      <el-input v-model="searchForm.txt" @input="handleSearch" placeholder="Type to search" />
    </el-form>

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
