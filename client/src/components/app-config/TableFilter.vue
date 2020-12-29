<template>
   <div id="TableFilter">
      <div class="disp">
         <h4>Filter application <span class="highlight">{{ $store.state.application.toUpperCase() }}</span> on branch <span class="highlight">{{ $store.state.branchSelection.split('.').slice(0, -1).join('.').toUpperCase() }}:</span></h4>
         <div class="filter-row">
            <div lg="3" md="12" class="filter-cell">
               <div class="my-label">What to view: </div>
               <b-form-radio-group id="btn-radios-1" @change.native="clearKeys()" button-variant="outline-secondary" v-model="selected.whatToView" :options="staticChoices.whatToView" buttons class="mt-1"></b-form-radio-group>
            </div>
            <div lg="8" class="filter-cell">
               <div class="my-label">Compare against: </div>
               <div v-for="branch in availableBranches" :key="branch" class="filterOpt env dark">
                  <label> {{ branch.split('.').slice(0, -1).join('.') }} </label>
                  <b-checkbox :value="branch" v-model="selected.branches" switch></b-checkbox>
               </div>
            </div>
            <div class="inline-block float-right">
               <b-button class="mr-2" @click="selected.envs = [...choices.envs]">Select all</b-button>
               <b-button variant="danger" @click="reset()">Reset</b-button>
            </div>
         </div>
         <b-row :set="opts = choices">
            <b-col sm="12"><multiselect :disabled="selected.whatToView == 'global'" v-model="selected.envs" :options="opts.envs" :multiple="true" :searchable="true" placeholder="Select environments..."></multiselect></b-col>
            <b-col sm="12"><multiselect :disabled="selected.whatToView == 'global'" v-model="selected.keys" :options="opts.keys" :multiple="true" :searchable="true" :placeholder="keyPlaceholder"></multiselect></b-col>
         </b-row>
      </div>
      <table-view :selected="selected"></table-view>
   </div>
</template>

<script>

import apiService from '../../apiService';
import TableView from './TableView';

export default {

   name: 'table-filter',
   components: {
      'table-view': TableView
   },

   data(){
      return {
         loading: false,
         staticChoices: {
            whatToView: [
               { text: 'app-configs', value: 'app' },
               { text: 'config', value: 'config' },
               { text: 'globals', value: 'global' }
            ]            
         },
         selected: {
            envs: [],
            keys: [],
            branches: [],
            whatToView: 'app'
         }
      }
   },

   // Clearing methods
   methods:{
      clearKeys(){
         this.selected.keys.forEach(keys => { this.selected.keys.pop() })
         this.selected.keys = []
      },
      clearEnvs(){
         this.selected.envs.forEach(env => {
            this.selected.envs.pop()
         })
         this.selected.envs = []
      },
      clearBranches(){
         this.selected.branches.forEach(branch => {
            this.selected.branches.pop();
         });
         this.selected.branches = []
      },
      reset(){
         this.clearKeys();
         this.clearEnvs();
         this.clearBranches();
      }
   },

   computed: {
      keyPlaceholder(){
         return this.selected.whatToView == 'app' ? 'Select applications...' : 'Select databases...';
      },
      availableBranches(){
         return _.without(this.$store.state.branchChoices, this.$store.state.branchSelection);
      },
      branchWatch() { return this.$store.state.branchSelection },
      appWatch() { return this.$store.state.application },
      whatToView() { return this.selected.whatToView }
   },

   watch: {
      appWatch(){
         this.reset();
      },
      branchWatch(){
         this.reset();
      },
      whatToView(){
         this.reset();
      }
   },

   asyncComputed: {

      choices: {
         async get() {

            // Get envs and app choices
            var envs = await apiService.getEnvs(this.$store.state.application, this.$store.state.branchSelection);
            var keys = await apiService.getKeys(this.$store.state.application, this.$store.state.branchSelection, this.selected.whatToView);

            return {
               envs: envs.data,
               keys: keys.data
            }
         },
         default: {
            envs: [],
            keys: []
         },
         // What for changes whatToView to refresh this data
         watch: ['selected.whatToView', '$store.state.application']
      }
   }
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

   .multiselect{
      margin-bottom: 10px;
      border-top: 1px solid rgba(165, 164, 164, 0.39);
      border-radius: 5px;
   }

   #TableFilter label{
      cursor: pointer;
   }

   .highlight{
      color: green;
   }

   .filter-cell{
      display: inline-block;
      margin-right: 20px;
      padding: 5px 5px 5px;
      border-radius: 7px;
      height: 100%;
   }

   .filter-row{
      margin-bottom: 20px;
      height: 85px;
   }

   h4{
      border-bottom: 2px dotted rgba(207, 207, 207, 0.596);
      padding-bottom: 5px;
      margin-bottom: 15px;
   }

   .multiselect__placeholder{
      font-size: 16px;
   }

   .my-label{
      font-weight: 600;
      margin-right: 10px;
   }

</style>