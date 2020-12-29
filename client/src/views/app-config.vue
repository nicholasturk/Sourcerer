<template>
  <div id="app-config">
    <app-config-menu></app-config-menu>
    <router-view></router-view>
  </div>
</template>

<script>

import menu from '../components/app-config/Menu'

export default {

  components: {
    'app-config-menu': menu
  }

}
</script>

<style>

</style>