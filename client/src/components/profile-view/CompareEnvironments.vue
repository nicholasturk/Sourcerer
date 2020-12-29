<template>
   <div id="compareEnvironments">
      <b-row class="pt-2 border-bottom">
         <b-col lg="4" class="tun-pad">
            <multiselect v-model="selectedEnvironments" :options="available.environments" :multiple="true" :searchable="true" placeholder="Compare against..."></multiselect>
         </b-col>
         <b-col class="pb-2">
            <div>Compare as: </div>
            <b-form-radio-group
               id="btn-radios-1"
               buttons
               :options="viewAs"
               name="radios-btn-default"
               class=""
               v-model="viewSelection"
               button-variant="outline-secondary"
            ></b-form-radio-group>
         </b-col>
      </b-row>
      <div v-if="viewSelection == 'single'">
         <div v-for="(env, idx) in filledData" :key="(env, idx)" class="disp mt-3">
            <env-vs-env :primaryData="overview" :viewSelection="viewSelection" :secondaryData="environmentsData[env]" :filledData="filledData" :compareName="env"></env-vs-env>
         </div> 
      </div>    
      <div v-else>
         <div class="disp mt-3">
            <env-vs-all :primaryName="envName" :primaryData="overview" :viewSelection="viewSelection" :environmentsData="environmentsData" :filledData="filledData"></env-vs-all>
         </div>
      </div>  
   </div>
</template>

<script>

import apiService from '../../apiService';
import envVsEnv from './envVsEnv';
import envVsAll from './envVsAll';

export default {

   props: ["overview"],
   name: 'environmentComparison',

   components: {
      "env-vs-env": envVsEnv,
      "env-vs-all": envVsAll
   },

   data(){
      return{
         envName: this.$route.params.id,
         available: {
            environments: []
         },
         viewSelection: 'all',
         viewAs: [
            {
               text: 'Multiple',
               value: 'all'
            },
            {
               text: 'Individual',
               value: 'single'
            }
         ],
         selectedEnvironments: [],
         filledData: [],
         environmentsData: {}
      }
   },


   async mounted(){
      this.fillData()
   },

   methods: {
      async fillData(){
         this.overview["name"] = this.envName
         this.available.environments = _.without((await apiService.getEnvs(this.$store.state.application, this.$store.state.branchSelection)).data, this.envName);
      }
   },

   watch: {
      // Figure out what to give the env vs envs, or env vs all in the loop
      async selectedEnvironments(newVal, oldVal){
         // New environment, get data and pass it along
         if (newVal.length > oldVal.length){
            var envName = newVal[newVal.length - 1]
            this.environmentsData[envName] = await apiService.getConfiguredFiles(this.$store.state.application, this.$store.state.branchSelection, envName)
            // Wait for filled data, this is important because it will try and render environmentsData, 
            // before the data actually gets filled, so I use filledData as a confirming variable
            this.filledData = Object.keys(this.environmentsData)
         } else{
            // This means a key got deleted, figure out which one, and remove it from environmentsData
            var environmentsDataKeys = Object.keys(this.environmentsData); 
            for(var i = 0; i < environmentsDataKeys.length; i++) {
               var isIn = this.selectedEnvironments.indexOf(environmentsDataKeys[i]);
               if(isIn == -1){
                  this.filledData.splice(this.filledData.indexOf(environmentsDataKeys[i]), 1)
                  delete this.environmentsData[environmentsDataKeys[i]]
                  break;
               }
            }
         }
      }
   }
}
</script>

<style>

   .tun-pad{
      padding-top: 23px;
   }

</style>