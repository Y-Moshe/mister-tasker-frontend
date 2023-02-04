<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { capitalize, debounce } from 'lodash'

import { taskService } from '../services/task.service'
import {
  socketService,
  SOCKET_EVENT_WORKER_STATUS,
  SOCKET_EVENT_TASKS_ADDED,
  SOCKET_EVENT_TASK_UPDATED,
  SOCKET_EVENT_TASK_DELETED,
  SOCKET_EVENT_TASKS_CLEARED
} from '../services/socket.service'

import taskPreviewActions from '../components/task-preview-actions.vue'
import taskPreview from '../components/task-preview.vue'
import taskActions from '../components/task-actions.vue'
import workerStatus from '../components/worker-status.vue'

const STATUS = taskService.STATUS

const tasks = ref([])
const searchText = ref('')
const isWorkerRunning = ref(true)
const totalPercentage = computed(() => {
  // to avoid NaN warning in case of no tasks
  if (!tasks.value.length) return 0;

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

onMounted(() => {
  loadTasks()
  getWorkerStatus()

  socketService.on(SOCKET_EVENT_WORKER_STATUS, updateWorkerStatus)
  socketService.on(SOCKET_EVENT_TASKS_ADDED, addTasks)
  socketService.on(SOCKET_EVENT_TASK_UPDATED, updateTask)
  socketService.on(SOCKET_EVENT_TASK_DELETED, deleteTask)
  socketService.on(SOCKET_EVENT_TASKS_CLEARED, clearAllTasks)
})

onUnmounted(() => {
  socketService.off(SOCKET_EVENT_WORKER_STATUS)
  socketService.off(SOCKET_EVENT_TASKS_ADDED)
  socketService.off(SOCKET_EVENT_TASK_UPDATED)
  socketService.off(SOCKET_EVENT_TASK_DELETED)
  socketService.off(SOCKET_EVENT_TASKS_CLEARED)
})

const loadTasks = async () => tasks.value = await taskService.getTasks()
async function getWorkerStatus() {
  const { isWorkerOn } = await taskService.getWorkerStatus()
  updateWorkerStatus(isWorkerOn)
}

function updateTask(task) {
  const idx = tasks.value.findIndex(({ _id }) => _id === task._id)
  tasks.value[idx] = task
}

const generateTasks = (count) => taskService.generateTasks(count)
const addTasks = (_tasks) => tasks.value.push(..._tasks)

const clearTasks = () => taskService.deleteAllTasks()
const clearAllTasks = () => tasks.value = []

const toggleTaskWorker = () => taskService.toggleTaskWorker()
const updateWorkerStatus = (isWorkerOn) => isWorkerRunning.value = isWorkerOn

async function handleStartTask(task) {
  const updatedTask = await taskService.performTask(task)
  task.status = STATUS.RUNNING
  updateTask(updatedTask)
}

const handleDeleteTask = (taskId) => taskService.deleteTask(taskId)
function deleteTask(taskId) {
  const idx = tasks.value.findIndex(({ _id }) => _id === taskId)
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
  const filterBy = { text: searchText.value }
  tasks.value = await taskService.getTasks(filterBy)
}, 500)
</script>

<template>
  <main>
    <h1>Mister tasker</h1>
    <p>A priority-queue for tasks, using MongoDB task collection.</p>
    <p>App behavior:</p>
    <p>In this app, you have control over the background service that automatically executes a task with the following criteria:</p>
    <ul>
      <li>A task that has the highest importance gets executed first!</li>
      <li>When a task failed, it gets re-executed until it reaches 5 tried count!</li>
      <li>When the 5 tried count is reached and still in a failed status the task gets skipped in favor of other tasks</li>
      <li>As for the done percentage it counts as finished since the service does not retry it (it can still get manually retry)</li>
    </ul>
    <p>Each task has a description with an error list that describes the error that occurs when failed</p>
    <p>And with all of that, you get a real-time interaction using WebSockets (sometimes it gets stuck due to render.com limits where the app is hosted)!</p>

    <el-row class="gap-10">
      <el-col :xs="24" :sm="{ span: 10, offset: 3 }" :md="{ span: 7, offset: 6 }">
        <worker-status
          :status="isWorkerRunning"
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
      <el-input v-model="searchText" @input="handleSearch" placeholder="Type to search" />
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
