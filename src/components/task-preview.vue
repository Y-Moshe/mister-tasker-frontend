<script setup>
import { defineProps } from 'vue'
import { Delete } from '@element-plus/icons-vue'
defineProps({
  task: Object
})
</script>

<template>
  <article class="task-preview">
    <h6>Description:</h6>
    <p>{{ task.description }}</p>
    <h6>Errors:</h6>
    <p>{{ task.errors.join(', ') }}</p>
    <p>Created at: {{ task.createdAt }} | Last tried at: {{ task.lastTriedAt }} | Done at: {{ task.doneAt }}</p>
    <el-popconfirm
      v-if="task.status === 'done'"
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
