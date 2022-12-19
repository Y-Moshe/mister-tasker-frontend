<script setup>
import { taskService } from '../services/task.service'
defineProps({
  task: Object
})

const STATUS = taskService.STATUS
</script>

<template>
  <section class="flex flex justify-content-around">
    <el-button plain type="success" class="start-btn"
      @click="$emit('start', task)" v-if="task.status === STATUS.NEW">
      Start
    </el-button>
    <el-button plain type="danger" class="retry-btn"
      @click="$emit('retry', task)" v-else-if="task.status === STATUS.FAILED">
      Retry
    </el-button>

    <router-link :to="'/task/edit/' + task._id" v-if="task.status !== STATUS.RUNNING" class="update-link">
      <el-button plain>Update</el-button>
    </router-link>

    <el-button plain type="danger" class="delete-btn"
      @click="$emit('delete', task._id)" v-if="task.status === STATUS.DONE">
      Delete
    </el-button>
  </section>
</template>
