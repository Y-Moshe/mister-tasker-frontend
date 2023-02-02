<template>
  <router-view class="main-layout"></router-view>
</template>
<script setup>
import { onMounted } from 'vue'
import { version } from '../package.json'

onMounted(() => console.log('App is running v' + version))
</script>