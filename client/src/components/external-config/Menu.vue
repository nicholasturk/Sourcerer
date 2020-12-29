<template>
   <div class="menu">
      <h4>External Configurations <b-icon icon="question-circle-fill" class="ml-2 mb-1 h5 questionHeader" v-b-modal.info-modal></b-icon> </h4>
      <b-nav class="mt-4" tabs>
         <b-nav-item to="/external-configurations/configure" :active="watchActive == '/external-configurations/configure'">Configure</b-nav-item>
         <b-nav-item to="/external-configurations/settings" :active="watchActive == '/external-configurations/settings'">Settings</b-nav-item>
      </b-nav>
      <b-modal id="info-modal" title="What is this?">
         <p>
            This is a page for viewing and editing <b>config.ini</b> files. You can either select single operations to view a specific file per app/environment,
            or choose bulk operations to edit every files rows.
         </p>
      </b-modal>
   </div>
</template>

<script>

export default {

   name: 'external-config-menu',

   computed: {
      watchActive(){
         return this.$route.fullPath
      },
   }
}

</script>


<style scoped>


</style>