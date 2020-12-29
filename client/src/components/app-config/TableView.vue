<template>
   <div id="TableView">
      <div class="disp">
         <h4 class="ml-2">Table View - <span class="green">{{ selected.whatToView == 'app' ? 'App-config.xml' : selected.whatToView == 'config' ? 'Config.xml' : 'Global configs'}}</span></h4>
         <div class="table-block" v-if="selected.whatToView == 'config'">
            <property-table :objKey="'Base attributes'" v-if="showArrow" :envs="selected.envs" :branches="branches" :choice="'config'"></property-table>
         </div>
         <div class="table-block" v-if="selected.whatToView == 'global'">
            <property-table :objKey="'Global configs'" v-if="showArrow" :envs="['global_configs']" :branches="branches" :choice="'global'"></property-table>
         </div>
         <div class="table-block" v-for="objKey in selected.keys" :key="objKey">
            <property-table v-if="showArrow" :objKey="objKey" :envs="selected.envs" :branches="branches" :choice="selected.whatToView == 'config' ? 'db' : selected.whatToView"></property-table>
         </div>
      </div>
   </div>
</template>

<script>

import PropertyTable from './PropertyTable';

export default {
   
   name: 'TableView',
   props: ['selected'],

   components: {
      'property-table': PropertyTable
   },

   data(){
      return{
         showArrow: true
      }
   },

   computed: {
      branches(){
         var temp = [this.$store.state.branchSelection];
         return temp.concat(this.selected.branches);
      }
   }
}

</script>

<style scoped>

   #TableView{
      margin-top: 20px;
   }

   .green{
      color: green;
   }

</style>