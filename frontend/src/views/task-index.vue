<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { capitalize, debounce } from 'lodash'

import { taskService } from '../services/task.service'
import {
  socketService,
  SOCKET_EVENT_WORKER_TASK_ENDED,
  SOCKET_EVENT_WORKER_TASK_STARTED,
  SOCKET_EVENT_WORKER_STATUS
} from '../services/socket.service'

import taskPreviewActions from '../components/task-preview-actions.vue'
import taskPreview from '../components/task-preview.vue'
import taskActions from '../components/task-actions.vue'
import workerStatus from '../components/worker-status.vue'

const STATUS = taskService.STATUS

const tasks = ref([])
const searchForm = ref({ txt: '' })
const isTaskWorkerRunning = ref(true)
const totalPercentage = computed(() => {
  if (!tasks.value.length) return 0; // to avoid NaN warning in case of no tasks

  const finishedTasks = tasks.value.reduce((prev, { status, triesCount }) => {
    // done status or failed with 5 triesCount counts as "done"
    if (
      status === STATUS.DONE ||
      (status === STATUS.FAILED && triesCount >= 5)
    ) {
      // counts as "finished" even if the status is "failed"
      prev++
    }

    return prev
  }, 0)

  // last percentage
  return (finishedTasks / tasks.value.length) * 100
})

onMounted(async () => {
  tasks.value = await taskService.getTasks()

  socketService.on(SOCKET_EVENT_WORKER_TASK_STARTED, updateTask)
  socketService.on(SOCKET_EVENT_WORKER_TASK_ENDED, updateTask)
  socketService.on(SOCKET_EVENT_WORKER_STATUS, updateWorkerStatus)

  getWorkerStatus()
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

function toggleTaskWorker() {
  taskService.toggleTaskWorker()
}

async function getWorkerStatus() {
  try {
    const { isWorkerOn } = await taskService.getWorkerStatus()
    updateWorkerStatus(isWorkerOn)
  } catch (err) {
    console.log('Failed to get worker status')
  }
}

function updateWorkerStatus(isWorkerOn) {
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

    <el-row class="gap-10">
      <el-col :xs="24" :sm="{ span: 10, offset: 3 }" :md="{ span: 7, offset: 6 }">
        <worker-status
          :status="isTaskWorkerRunning"
          :percentage="totalPercentage"
          @change="toggleTaskWorker"
        />
      </el-col>
      <el-col :xs="24" :sm="8" :md="5">
        <task-actions
          @generateTask="generateTasks(1)"
          @generateTasks="generateTasks(10)"
          @clearAll="clearTasks()"
        />
      </el-col>
    </el-row>


    <!-- Search -->
    <el-form style="margin: 15px;">
      <el-input v-model="searchForm.txt" @input="handleSearch" placeholder="Type to search" />
    </el-form>

    <!-- Tasks table -->
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
          <task-preview-actions :task="scope.row"
            @delete="handleDeleteTask"
            @start="handleStartTask"
            @retry="handleStartTask" />
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>
