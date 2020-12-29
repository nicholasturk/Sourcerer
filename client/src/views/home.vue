<template>
  <div id="app-config">
    <home-menu></home-menu>
    <router-view></router-view>
  </div>
</template>

<script>

import homeMenu from '../components/home/Home';

export default {

  components: {
    homeMenu
  }

}
</script>

<style>

</style>