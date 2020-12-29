<template>
   <div id="globalconfigs" class="content">
      <div class="display">
         <h2 class="head-top">Filter</h2>
         <b-row class="mt-3">
            <b-col>
               <div class="mb-2">
                  <label class="view-label inline-block">Compare branch <span class="branch">{{ $store.state.branchSelection.split('.').slice(0, -1).join('.') }}</span> against<span v-if="$store.state.branchesToCompare.length < 1"> (not required)</span>: </label>
               </div>
               <div>
                  <div v-for="branch in availableBranches" class="inline-block filterOpt dark" :key="branch">
                  <label> {{ branch.split('.').slice(0, -1).join('.') }} </label>
                     <b-checkbox 
                        :value="branch"
                        v-model="selected.branches"  
                        switch>
                     </b-checkbox>
                  </div>
               </div>
            </b-col>
         </b-row>
      </div>
      <property-table :objKey="'global_configs'" :envs="['global_configs']" :branches="branches" :choice="'global'" ></property-table>
   </div>
</template>

<script>

import apiService from '../../apiService';

export default {

   data(){
      return {
         selected: {
            branches: []
         }
      }
   },

   // Reset branches
   methods: {
      reset(){
         this.selected.branches.forEach(branch => {
            this.selected.branches.pop()
         })
         this.selected.branches = []
      }
   },

   computed: {

      // Branches without currently selected one
      availableBranches(){
         return _.without(this.$store.state.branchChoices, this.$store.state.branchSelection);
      },

      // Watch for state changes
      branchWatch() { 
         return this.$store.state.branchSelection 
      },
      appWatch() { 
         return this.$store.state.application 
      },
      branches(){
         var temp = [this.$store.state.branchSelection];
         return temp.concat(this.selected.branches);
      }
   },

   // Watch for state changes
   watch: {
      appWatch(){
         this.reset();
      },
      branchWatch(){
         this.reset();
      }
   }
}
</script>

<style>
   
</style>