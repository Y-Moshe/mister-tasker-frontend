<script setup>
defineProps({
  task: Object
})
</script>

<template>
  <section class="flex flex justify-content-around">
    <el-button plain type="success"
      @click="$emit('start', task)" v-if="task.status === 'new'">
      Start
    </el-button>
    <el-button plain type="danger"
      @click="$emit('retry', task)" v-else-if="task.status === 'failed' && task.triesCount < 5">
      Retry
    </el-button>

    <router-link :to="'/task/edit/' + task._id">
      <el-button plain>Update</el-button>
    </router-link>

    <el-button v-if="task.status === 'done'" type="danger" @click="$emit('delete', task._id)" plain>Delete</el-button>
  </section>
</template>
