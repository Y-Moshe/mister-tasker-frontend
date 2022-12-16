import { httpService } from './http.service'
import { utilService } from './util.service'

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

function performTask(task) {
  return httpService.put(`/task/${task._id}/start`, task)
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

function generateTask() {
  const task = {
    _id: utilService.makeId(),
    title: utilService.makeLorem(5),
    status: Math.random() > 0.5 ? 'done' : 'failed',
    description: utilService.makeLorem(10),
    importance: utilService.getRandomIntInclusive(1, 3),
    lastTriedAt: Date.now(),
    triesCount: utilService.getRandomIntInclusive(1, 5),
    doneAt: Date.now(),
    errors: []
  }
  return task
}

function generateTasks(count) {
  return new Array(count).fill(null).map(() => generateTask())
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
  generateTask,
  generateTasks
}