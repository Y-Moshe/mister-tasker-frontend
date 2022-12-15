<script setup>
import { defineProps } from 'vue'
defineProps({
  task: Object
})
</script>

<template>
  <section class="table-actions">
    <el-button>Start task</el-button>
    <router-link to="/">
      <router-link :to="'/task/edit/' + task._id">
        <el-button plain>Update</el-button>
      </router-link>
      <el-popconfirm
        :icon="null"
        confirm-button-text="Yes" 
        title="Are you sure to delete this?"
        @confirm="$emit('delete')">
        <template #reference>
          <el-button type="danger" plain>Delete</el-button>
        </template>
      </el-popconfirm>
    </router-link>
  </section>
</template>
