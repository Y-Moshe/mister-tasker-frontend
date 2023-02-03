<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { Delete } from '@element-plus/icons-vue'
import { taskService } from '../services/task.service'
const props = defineProps({ task: Object })

const STATUS = taskService.STATUS
const getTime = (timpestamp) => timpestamp && moment(new Date(timpestamp)).fromNow()

const createdAt = computed(() => getTime(props.task.createdAt))
const lastTriedAt = computed(() => getTime(props.task.lastTriedAt))
const doneAt = computed(() => getTime(props.task.doneAt))
</script>

<template>
  <article class="task-preview">
    <h3>Description:</h3>
    <p>{{ task.description }}</p>
    <h3>Errors:</h3>
    <p>{{ task.errors.join(', ') }}</p>
    <p>
      <span v-if="createdAt">Created at: {{ createdAt }}</span>
      <template v-if="lastTriedAt">
        <el-divider direction="vertical" />
        <span>Last tried at: {{ lastTriedAt }}</span>
      </template>
      <template v-if="doneAt">
        <el-divider direction="vertical" />
        <span>Done at: {{ doneAt }}</span>
      </template>
    </p>
    <el-popconfirm
      v-if="task.status === STATUS.DONE"
      :icon="null"
      confirm-button-text="Yes"
      title="Are you sure you want to delete this?"
      @confirm="$emit('delete', task._id)">
      <template #reference>
        <el-button type="danger" class="delete-btn" :icon="Delete"></el-button>
      </template>
    </el-popconfirm>
  </article>
</template>
