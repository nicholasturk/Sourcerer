<template>
   <div class="menu" id="appconfigmenu">
      <h4 class="mb-3 pb-3">
         Application Configurations <b-icon icon="question-circle-fill" class="ml-2 mb-1 mb-0 h5 questionHeader" v-b-modal.info-modal></b-icon>
      </h4>
      <b-nav class="mt-4" tabs>
         <b-nav-item to="/app-config-xml/search" :active="watchActive == '/app-config-xml/search'">Search</b-nav-item>
         <b-nav-item to="/app-config-xml/table-builder" :active="watchActive == '/app-config-xml/table-builder'">Table Builder</b-nav-item>
         <b-nav-item to="/app-config-xml/branch-diffs" :active="watchActive == '/app-config-xml/branch-diffs'">Branch diffs</b-nav-item>
         <b-nav-item to="/app-config-xml/statistics" :active="watchActive == '/app-config-xml/statistics'">Statistics</b-nav-item>
      </b-nav>
      <b-modal id="info-modal" title="What is this?">
         <p>
            This is a page for viewing <b>appconfig.xml, plugin.xml and config.xml</b> files for Policy Center and Billing Center.
         </p>
      </b-modal>
   </div>
</template>

<script>

import apiService from '../../apiService';

export default {

   name: 'app-config-menu',

   data(){
      return {
         appLoading: false,
         loading: false,
         applicationOptions: 
            [
               { text: 'Policy', value: 'pc' },
               { text: 'Billing', value: 'bc' }
            ],
         search: 'sdf'
      }
   },

   computed: {
      // Returns the url path to determine which menu tab should be active
      watchActive(){
         return this.$route.fullPath
      },
   },

   asyncComputed: {
      branchOptions: {
         async get(){
            
            var branches = await apiService.getFileNames(this.$store.state.application); 
            this.$store.dispatch('getBranchChoices', branches);

            var data = []
            branches.forEach(branch => {
               data.push({ text: !(branch == 'MAINTENANCE_LONG_TERM.json') ? branch.split('.').slice(0, -1).join('.') : 'MLT' , value: branch  })
            })

            return data
         }
      }
   },

   // Generates report.. see apiService.generateReport() for more detail
   methods: {
      refreshBranchChoices(){
         this.$store.dispatch('getBranchChoices', this.$store.state.application);
      },
      generateReport(){
         this.$Progress.start()
         apiService.generateReport();
         this.$Progress.finish()
      }
   }
}

</script>


<style>

   .sourcerer-header{
      color: white;
      font-size: 24px;
   }



   .title{
      color: white;
      user-select: none;
      cursor: pointer;
   }

   .menu{
      margin-top: 20px;
   } 

   .version{
      font-size: 12px;
   }

   .branchH{
      margin-left: 57px;
   }

   a:hover{
      color: black;
      text-decoration: none;
   }

   a{
      text-decoration: none;
   }

   a:hover{
      text-decoration: none !important;
   }

   a:-webkit-any-link:focus {
    outline-offset: none;
}

</style>