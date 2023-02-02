<template>
  <router-view class="main-layout"></router-view>
</template>
<script>
import { version } from '../package.json'
export default {
  created() {
    console.log('App is running v' + version)
  }
}
</script>