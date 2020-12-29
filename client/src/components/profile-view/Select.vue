<template>
   <div id="profileSelect">
      <div class="my-container mt-5">
         <h3 class="mb-4 border-bottom pb-2">Select Environment..</h3>
         <b-row>
            <b-col class="disp mr-5" v-for="(cat, idx) in Object.keys(envsCat)" :key="(cat, idx)">
               <span class="envHeader border-bottom mb-2"> {{ cat.toUpperCase() }} </span>
               <router-link :to="`/profile-view/view/${env}`" class="env-link" v-for="(env, idx) in envsCat[cat]" :key="(env, idx)">
                  <div class="pl-2 mb-2 border-bottom">
                     {{ env }}
                  </div>
               </router-link>
            </b-col>
         </b-row>
      </div>
   </div>
</template>

<script>

import apiService from '../../apiService';
import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'

export default {

   name: 'profileSelect',

   components: {
      HorizontalScroll
   },

   data(){
      return{
         envs: [],
         files: [],
         fileSearch: ''
      }
   },

   // Load envs
   async mounted(){
      this.envs = (await apiService.getEnvs(this.$store.state.application, this.$store.state.branchSelection)).data;
   },

   computed: {

      // Categorize environments (this is easy to change to anyones liking)
      envsCat() {
         var myCats = {
            "prod": [],
            "dev": [],
            "qa": [],
            "ratedev": [],
            "sit": [],
            "local": [],
            "other": []
         };

         var catsKeys = Object.keys(myCats);
         this.envs.forEach(env => {
            var found = false;
            for(var i = 0; i < catsKeys.length; i++){
               if(env.toLowerCase().startsWith(catsKeys[i].toLowerCase())){
               myCats[catsKeys[i]].push(env);
               found = true;
               break;
            }
         }
         found == false ? myCats["other"].push(env) : _
         });
         return myCats;
      },

      filteredFiles(){
         return this.files.filter((file) => {
            return file.toLowerCase().match(this.fileSearch.toLowerCase());
         })
      },

      branchWatch() { return this.$store.state.branchSelection },
      appWatch() { return this.$store.state.application }
   },

   watch: {
      async appWatch(){
         this.envs = (await apiService.getEnvs(this.$store.state.application, this.$store.state.branchSelection)).data;
         this.files = (await apiService.getKeys(this.$store.state.application, this.$store.state.branchSelection, 'app')).data;
      }
   },
}

</script>

<style scoped>


   .envHeader{
      margin-bottom: 2px;
      font-size: 20px;
      color: rgb(0, 0, 0);
      display: block;
      font-weight: 600;
   }

   .env-link{
      color: rgb(61, 67, 156);
      font-size: 20px;
   }

   .finp{
      font-size: 15px;
      padding: 5px 5px 5px 5px;
      margin-bottom: 5px;
   }


</style>