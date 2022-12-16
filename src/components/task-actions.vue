<script setup>
import { taskService } from '../services/task.service'
defineProps({
  task: Object
})

const STATUS = taskService.STATUS
</script>

<template>
  <section class="flex flex justify-content-around">
    <el-button plain type="success"
      @click="$emit('start', task)" v-if="task.status === STATUS.NEW">
      Start
    </el-button>
    <el-button plain type="danger"
      @click="$emit('retry', task)" v-else-if="task.status === STATUS.FAILED && task.triesCount < 5">
      Retry
    </el-button>

    <router-link :to="'/task/edit/' + task._id" v-if="task.status !== STATUS.RUNNING">
      <el-button plain>Update</el-button>
    </router-link>

    <el-button v-if="task.status === STATUS.DONE" type="danger" @click="$emit('delete', task._id)" plain>Delete</el-button>
  </section>
</template>
