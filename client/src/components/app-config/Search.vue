<template>
   <div id="search" class="">
      <div class="searchWrapper disp">
         <h4 class="mb-4">Search application <span class="highlight">{{ $store.state.application.toUpperCase() }}</span> on branch <span class="highlight">{{ $store.state.branchSelection.split('.').slice(0, -1).join('.').toUpperCase() }}:</span></h4>
         <div class="input-group">
            <b-input-group>
               <b-input-group-prepend>
                  <b-input-group-text>Query: </b-input-group-text>
               </b-input-group-prepend>
               <b-form-input type="search" placeholder="Search for anything..." @keyup.enter="search(query, 0)"  v-model="query"></b-form-input>
               <b-input-group-append>
                  <b-button variant="success" :disabled="query.length == 0" @click="search(query, 0)"> <span v-if="!loading">Search</span><b-spinner v-if="loading" small></b-spinner></b-button>
               </b-input-group-append>
            </b-input-group>
            <b-button variant="danger" style="float: right;" class="inline-block" @click="clear()">Clear result</b-button>
         </div>
         <b-row>
            <b-col lg="1">
               <h6 class="mt-2" for="">Precision: {{ precision }} </h6>
            </b-col>
            <b-col lg="3" class="mt-2">
               <b-form-input type="range" v-model="precision"></b-form-input>
            </b-col>
         </b-row>
      </div>
      <div class="result disp" v-if="foundSomething && result.type">
         <h3 v-if="result.type == 'many'">{{ Object.keys(result.items).length }} matches found based on the search <span class="found">'{{ searchTerm }}'</span>: </h3>
         <div v-if="result.type == 'many'">
            <results :result="result"></results>
         </div>
      </div>
      <div class="result" v-if="!foundSomething && searchTerm != ''">
         <h3>I couldn't find anything based on the search <span class="found">'{{ searchTerm }}'</span> </h3>
      </div>
      <div v-if="searchTerm != '' && foundSomething" class="wrong">
         Not what you were looking for? Try narrowing your query by excluding the files or environments.
      </div>
   </div>
</template>

<script>

import apiService from '../../apiService';
import Results from './Results';

export default {

   name: 'search',

   components: {
      'results': Results
   },

   data(){
      return {
         query: '',
         loading: false,
         result: null,
         searchTerm: '',
         files: [],
         foundSomething: false,
         precision: 50
      }
   },

   methods: {

   slideStart () {
      console.log('slideStarted')
    },
    slideStop () {
      console.log('slideStopped')
    },

      // Get search results
      async search(query, depth, isChain){

         // Clear previous search
         this.clear();
         this.clearFiles();

         //Remove '/' from search because it's a url paramter and wont work that way 
         query = query.replace(/\//g, "_")

         // Get data
         this.loading = true
         this.result = await apiService.search({
            query: query,
            app: this.$store.state.application,
            branch: this.$store.state.branchSelection,
            precision: this.precision
         });

         // Check if there were any results
         this.searchTerm = query;
         if (Object.keys(this.result).length > 0) this.foundSomething = true;
         else this.foundSomething = false;
         this.loading = false
      },

      clear(){
         this.searchTerm = '';
         this.foundSomething = false;
      },

      // Show files
      dispFiles(env){
         if (this.files.length > 0){
            this.clearFiles()
            return
         }
         this.files = Object.keys(this.$store.state.jsonObject[env]["app_config"])
      }, 
      clearFiles(){
         this.files.forEach(file => {
            this.files.pop()
         })
         this.files = []
      }
   }

}
</script>

<style scoped>

   #search{
      padding: 20px 20px;
   }

   .result{
      margin-top: 30px;
   }

   .btn{
      min-width: 80px;
   }

   .input-group{
      width: 75%;
      margin-right: 0px;
   }

   .wrong{
      margin-top: 20px;
      font-weight: bold;
   }

   .searchLink{
      cursor: pointer;
      background-color: rgb(206, 206, 206);
      margin-right: 10px;
      padding-left: 5px;
      border-radius: 5px 5px 5px 5px;
      padding-right: 5px;
      font-weight: bold;
      color: rgb(87, 87, 87);
      margin-bottom: 10px;
   }

   .answer{
      font-size: 20px;
      margin-bottom: 10px;
   }

   .found{
      font-weight: bold;
      color: red;
   }

   .highlight{
      font-weight: bold;
      color: green;
   }

</style>