<script setup>
import { useRouter } from 'vue-router'
import { CirclePlus, DeleteFilled, Plus, Operation } from '@element-plus/icons-vue'
defineProps({ task: Object })
const emit = defineEmits(['generateTask', 'generateTasks', 'clearAll'])

const router = useRouter()
const navigateToAddTask = () => router.push('/task/edit')
</script>

<template>
  <el-card class="task-actions">
    <el-button type="success" :icon="Plus" @click="navigateToAddTask">Add task</el-button>
    <el-button type="warning" @click="emit('generateTask')" :icon="CirclePlus">Generate single task</el-button>
    <el-button type="primary" @click="emit('generateTasks')" :icon="Operation">Generate tasks</el-button>
    <el-button type="danger" @click="emit('clearAll')" :icon="DeleteFilled">Clear all</el-button>
  </el-card>
</template>
