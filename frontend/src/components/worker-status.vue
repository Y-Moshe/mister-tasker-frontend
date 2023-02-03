<script setup>
import { computed } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
const props = defineProps({
  status: Boolean,
  percentage: Number
})
const emit = defineEmits(['change'])

const statusBtnType = computed(() => props.status ? 'success' : 'danger')
const statusType = computed(() => props.status ? 'success' : 'exception')
const statusIcon = computed(() => props.status ? Check : Close)
</script>

<template>
  <el-card class="worker-status">
    <template #header>
      Background service: {{ status ? 'Running' : 'Stopped' }}
      <el-switch :modelValue="status" @change="emit('change', !status)" class="float-right" />
    </template>

    <div class="flex justify-content-center gap-10">
      <el-progress type="circle" :percentage="100" :status="statusType">
        <el-button :type="statusBtnType" :icon="statusIcon" circle />
      </el-progress>
  
      <el-progress type="dashboard" :percentage="percentage">
        <template #default="{ percentage }">
          <p>{{ percentage.toFixed(2) }}%</p>
          <p v-if="percentage < 100">Progressing</p>
          <p v-if="percentage === 100">Done</p>
        </template>
      </el-progress>
    </div>
  </el-card>
</template>
