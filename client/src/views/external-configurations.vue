<template>
   <div id="external-configurations">
      <external-configuration-menu></external-configuration-menu>
      <router-view></router-view>
   </div>
</template>

<script>

import Menu from '../components/external-config/Menu';

export default {

   name: 'exteral-configurations',

   components: {
      'external-configuration-menu': Menu
   }

}
</script>

<style>

</style>