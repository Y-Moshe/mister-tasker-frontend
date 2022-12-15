import { httpService } from './http.service'

function getTasks() {
  return httpService.get('/task')
}

function getTask(taskId) {
  return httpService.get('/task/' + taskId)
}

function addTask(task) {
  return httpService.post('/task', task)
}

function updateTask(task) {
  return httpService.put('/task/' + task._id, task)
}

function performTask(taskId) {
  return httpService.put(`/task/${taskId}/start`)
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

export const taskService = {
  getTasks,
  getTask,
  addTask,
  updateTask,
  performTask,
  deleteTask,
  deleteAllTasks,
  getEmptyTask
}