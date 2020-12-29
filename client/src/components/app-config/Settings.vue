<template>
   <div id="settings">
      <b-row class="setting disp">
         <b-col>
            <h5 class="inline-block mb-0 pt-1">Color mode.....</h5> 
            <b-form-radio-group
            id="btn-radios-1"
            v-model="$store.state.settings.colorMode"
            :options="viewOptions"
            buttons
            class="float-right"
            name="radios-btn-default"
            button-variant="outline-secondary"
            @change="changeMode()"
            ></b-form-radio-group>
         </b-col>
      </b-row>
      <b-row class="setting disp">
         <b-col>
            <h5 class="inline-block mb-0 pt-1">Update branches from artifactory.....</h5>
            <b-button variant="success" size="md" class="float-right" @click="updateBranches()">Commit</b-button>
            <div v-if="updateBranchesLoading" class="float-right pt-2 mr-2">
               <b-spinner small></b-spinner>
            </div>
            <div class="float-right pt-2"><span style="color: green;">{{ updateBranchesMessage }}</span></div>
         </b-col>
         <vue-progress-bar></vue-progress-bar>
      </b-row>
   </div>
</template>

<script>

import apiService from '../../apiService';

export default {
   data(){
      return{
         viewOptions: [
            { text: 'Light Mode', value: 'light' },
            { text: 'Dark Mode', value: 'dark' }
         ],
         branch_options: [],
         updateBranchesMessage: '',
         updateBranchesLoading: false,
         test: []
      }
   },
   methods: {
      // Dark mode
      changeMode(){
         if(this.$store.state.settings.colorMode == 'light')
            document.querySelector(':root').style.filter = 'invert(1) hue-rotate(360deg)';
         else
            document.querySelector(':root').style.filter = '';
      },

      // Update branches from app
      async updateBranches(){
         this.updateBranchesLoading = true;
         this.$Progress.start()
         var t0 = performance.now();
         this.updateBranchesMessage = await apiService.refreshBranches();
         var t1 = performance.now();
         this.$Progress.finish();
         this.updateBranchesMessage += ' in ' + ((t1 - t0) / 1000) + ' seconds.';
         this.updateBranchesLoading = false;
      }
   },
}
</script>

<style>

   #settings{
      padding: 0px 20px 20px 20px;
   }

   .setting{
      margin-top: 25px;
      margin-left: 5px;
      margin-right: 5px;
      padding-bottom: 10px;
      border-bottom: 2px solid lightgray;
   }

</style>