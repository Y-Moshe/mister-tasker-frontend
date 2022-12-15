<script setup>
import { ref, onMounted } from 'vue'
import { taskService } from '../services/task.service'
const tableData = ref([])

onMounted(async () => {
  tableData.value = await taskService.getTasks()
})

</script>

<template>

  <main class="main-dashboard">
    <el-table :data="tableData">

      <el-table-column prop="title" label="Title" min-width="120" />

      <el-table-column prop="importance" label="Importance" sortable min-width="100" />

      <el-table-column prop="status" label="Status" min-width="140" />

      <el-table-column prop="triesCount" label="Tries count" min-width="140" sortable />

      <el-table-column label="Actions" min-width="100" align="center">
        <template #default="scope">
          <router-link to="/">
            <el-button plain>Update</el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>
  </main>

</template>
