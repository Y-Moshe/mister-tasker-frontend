<script setup>
import { defineProps } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { taskService } from '../services/task.service'

defineProps({
  task: Object
})

const STATUS = taskService.STATUS
</script>

<template>
  <article class="task-preview">
    <h3>Description:</h3>
    <p>{{ task.description }}</p>
    <h3>Errors:</h3>
    <p>{{ task.errors.join(', ') }}</p>
    <p>Created at: {{ task.createdAt }} | Last tried at: {{ task.lastTriedAt }} | Done at: {{ task.doneAt }}</p>
    <el-popconfirm
      v-if="task.status === STATUS.DONE"
      :icon="null"
      confirm-button-text="Yes" 
      title="Are you sure to delete this?"
      @confirm="$emit('delete', task._id)">
      <template #reference>
        <el-button type="danger" class="delete-btn" :icon="Delete"></el-button>
      </template>
    </el-popconfirm>
  </article>
</template>
