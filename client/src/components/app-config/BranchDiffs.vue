<template>
   <div id="branchDiffs">
      <div class="disp">
         <h4>Branch Differences</h4>
         <span class="fw-sm">*this does not include config.xml files - to view those, simply go to table builder, select config, choose all environments, compare against desired branch, then show: diff on the table</span>
         <b-row v-for="(doc, idx) in documents" class="border diffrow mb-4 mt-3" :key="(doc, idx)">
            <b-col class="bgg-g" lg="12">
               <h6>{{ `${doc["_id"]["environment"]} - ${doc["_id"]["file_name"]}` }}</h6>
            </b-col>
            <b-col :class="{ 'bgg': idx == 0, 'bgr': idx != 0 }" v-for="(props, idx) in doc.configured_props_holder" class="diffbox p-2 border w-50 bw" :key="(props, idx)">
               <h6 class="border-bottom pb-1"> {{ props.branch.split('.').slice(0, -1).join('.') }} </h6>
               <div class="props">
                  <div v-for="(propName, idx) in Object.keys(props)" :key="(propName, idx)">
                     <div v-if="propName != 'branch'" class="propsgit">
                        {{ propName +': ' }}
                        {{ props[propName] }}
                     </div>
                  </div>
               </div>
            </b-col>
         </b-row>
      </div>
   </div>
</template>

<script>

import apiService from '../../apiService';
import {_} from 'vue-underscore';

export default {

   name: 'branch-diffs',

   data(){
      return {
         documents: []
      }
   },

   // Fill data on mounted stage (this is how it's usually done, I just put it in a method in case there's a time it needs to be refilled)
   async mounted(){
      await this.fillData();
   },

   methods: {

      // Get documents and sort them so the currently selected branch appears on the left hand side
      async fillData(){
         this.documents = await apiService.getGitDifferences(this.$store.state.application);
         this.sortDocs();
      },

      // This is hardcoded for 2 branches only currently the backend code is setup to handle as many as possible :) it's just this function to sort so the selected branch displays in the first column...
      sortDocs(){
         this.documents.forEach(doc => {
            if (!(doc["configured_props_holder"][0]["branch"] == this.$store.state.branchSelection)) {
               var tmp = doc["configured_props_holder"][0]["branch"]
               doc["configured_props_holder"][0]["branch"] = doc["configured_props_holder"][1]["branch"]
               doc["configured_props_holder"][1]["branch"] = tmp;
            }
         });
         this.documents.sort((a,b) => (a._id.environment > b._id.environment) ? 1 : ((b._id.environment > a._id.environment) ? -1 : 0));
      },
   },

   computed: {

      // Returns branch without the currently selected one
      compareBranch(){
         return _.without(this.$store.state.branchChoices, this.$store.state.branchSelection)[0];
      },

      // Watch for state changes
      appWatch(){ return this.$store.state.application },
      branchWatch(){ return this.$store.state.branchSelection },
   },

   watch: {
      appWatch(){ this.fillData() },
      branchWatch() { this.fillData() }
   }

}
</script>

<style>

   #branchDiffs{
      padding: 20px 20px 20px 20px;
   }

   .propsgit{
      font-weight: 500;
      font-size: 14px;
   }

   .bw{
      word-break: break-all;
   }

   .bgg{
      background-color: rgba(120, 250, 120, 0.61);
   }
   .bgg-g{
      background-color: rgba(223, 223, 223, 0.459);
   }

   .fw-sm{
      font-size: 12px;
      color: rgb(10, 10, 10);
   }

   .bgr{
      background-color: rgba(253, 193, 193, 0.671);
   }

   .diffrow{
      border-radius: 5px;
   }

</style>