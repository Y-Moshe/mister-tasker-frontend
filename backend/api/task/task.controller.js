const taskService = require('./task.service')
const workerService = require('../../services/worker.service')
const socketService = require('../../services/socket.service')

const logger = require('../../services/logger.service')

async function getTasks(req, res) {
  try {
    logger.debug('Getting Tasks')
    const tasks = await taskService.query(req.query)
    res.json(tasks)
  } catch (err) {
    logger.error('Failed to get tasks', err)
    res.status(500).send({ err: 'Failed to get tasks' })
  }
}

async function getTaskById(req, res) {
  try {
    const taskId = req.params.id
    const task = await taskService.getById(taskId)
    res.json(task)
  } catch (err) {
    logger.error('Failed to get task', err)
    res.status(500).send({ err: 'Failed to get task' })
  }
}

async function addTask(req, res) {
  try {
    const task = req.body
    const addedTask = await taskService.add(task)
    res.json(addedTask)
  } catch (err) {
    logger.error('Failed to add task', err)
    res.status(500).send({ err: 'Failed to add task' })
  }
}

async function generateTasks(req, res) {
  try {
    const { count } = req.body
    const generatedTasks = await taskService.generateTasks(+count)
    res.json(generatedTasks)
  } catch (err) {
    logger.error('Failed to generate tasks', err)
    res.status(500).send({ err: 'Failed to generate tasks' })
  }
}

async function updateTask(req, res) {
  try {
    const task = req.body
    const updatedTask = await taskService.update(task)
    res.json(updatedTask)
  } catch (err) {
    logger.error('Failed to update task', err)
    res.status(500).send({ err: 'Failed to update task' })
  }
}

async function performTask(req, res) {
  try {
    const task = req.body
    task._id = req.params.id
    const perfomedTask = await taskService.perform(task)
    res.json(perfomedTask)
  } catch (error) {
    logger.error('Failed to perform task', err)
    res.status(500).send({ err: 'Failed to perform task' })
  }
}

function toggleWorker(req, res) {
  try {
    console.log('toggling worker');
    const isWorkerOn = workerService.toggleWorker()
    socketService.broadcast({
      type: socketService.SOCKET_EMIT_WORKER_STATUS,
      data: isWorkerOn
    })
    res.json({ isWorkerOn })
  } catch (error) {
    logger.error('Failed to toggle the worker', err)
    res.status(500).send({ err: 'Failed to toggle the worker' })
  }
}

function getWorkerStatus(req, res) {
  try {
    console.log('getting worker status');
    res.json({
      isWorkerOn: workerService.workerState.isWorkerOn
    })
  } catch (error) {
    logger.error('Failed to get worker status', err)
    res.status(500).send({ err: 'Failed to get worker status' })
  }
}

async function removeTask(req, res) {
  try {
    const taskId = req.params.id
    const removedId = await taskService.remove(taskId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove task', err)
    res.status(500).send({ err: 'Failed to remove task' })
  }
}

async function removeAllTasks(req, res) {
  try {
    await taskService.removeAll()
    res.end()
  } catch (err) {
    logger.error('Failed to remove tasks', err)
    res.status(500).send({ err: 'Failed to remove tasks' })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
  performTask,
  toggleWorker,
  generateTasks,
  removeAllTasks,
  getWorkerStatus
}
