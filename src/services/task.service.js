import { httpService } from './http.service'

function getTasks(filterBy = {}) {
  return httpService.get('/task', filterBy)
}

function getTask(taskId) {
  return httpService.get('/task/' + taskId)
}

function addTask(task) {
  return httpService.post('/task', task)
}

function generateTasks(count) {
  return httpService.post('/task/generate', { count })
}

function updateTask(task) {
  return httpService.put('/task/' + task._id, task)
}

function performTask(task) {
  return httpService.put(`/task/${task._id}/start`, task)
}

function toggleTaskWorker() {
  return httpService.put('/task/workerToggle')
}

function deleteTask(taskId) {
  return httpService.delete('/task/' + taskId)
}

function deleteAllTasks() {
  return httpService.delete('/task')
}

function getEmptyTask() {
  return {
    title: '',
    status: '',
    description: '',
    importance: 0,
    lastTriedAt: 0,
    triesCount: 0,
    doneAt: 0,
    errors: []
  }
}

const ERRORS = [
  'High Temparture',
  'Server busy',
  'Server under maintanence',
  'Requested resource is no longer available',
  'Gateway timeout'
]

const STATUS = {
  NEW: 'new',
  RUNNING: 'running',
  FAILED: 'failed',
  DONE: 'done'
}

export const taskService = {
  getTasks,
  getTask,
  addTask,
  updateTask,
  performTask,
  deleteTask,
  deleteAllTasks,
  getEmptyTask,
  generateTasks,
  toggleTaskWorker,
  ERRORS,
  STATUS
}