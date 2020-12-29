<template>
  <div id="ProfileView">
     <div id="profile-container" class="border p-3 mt-5">
        <div class="mt-3 pb-2 px-4">
           <h4 class="border-bottom h2">{{ $route.params.id }}</h4>  
        </div>
        <div class="content">
            <b-tabs pills card>
               <b-tab title="Overview" active>
                  <b-card-text>
                     <b-card-group deck>
                        <b-card header-tag="header" footer-tag="footer">
                           <div class="cbod">Tagged in <span class="text-success"> {{ overview.numFiles }} </span> application configurations. </div>
                           <template #footer>
                              <span class="file-preview"> {{ randFiles[0] }}, </span>
                              <span class="file-preview"> {{ randFiles[1] }}... </span>
                           </template>
                        </b-card>
                        <b-card footer-tag="footer">
                           <div class="cbod">Missing env tag in <span class="text-danger">{{ overview.missingFiles }}</span> files.  </div>
                           <template #footer>
                              <span class="file-preview"> {{ randMissingFiles[0] }}, </span>
                              <span class="file-preview"> {{ randMissingFiles[1]  }}... </span>
                           </template>
                        </b-card>
                        <b-card
                           footer-tag="footer"
                        >
                        <div class="cbod"> <span class="text-success">{{ overview.numProps }}</span> properties configured.  </div>
                           <template #footer>
                              <span class="file-preview"> {{ randProps[0] }}, </span>
                              <span class="file-preview"> {{ randProps[1] }}... </span>
                           </template>
                        </b-card>
                     </b-card-group>
                  </b-card-text>
               </b-tab>
               <b-tab title="Compare">
                  <compareEnvironments :overview="overview"></compareEnvironments>
               </b-tab>
               <b-tab title="Applications">
                  <b-card-text>
                     <b-input placeholder="Search for a file..." class="w-50 mb-2 inline-block" v-model="fileSearch"> ></b-input>
                     <b-form-radio-group id="btn-radios-1" class="block ml-3 mt-0 pb-1" button-variant="outline-secondary" v-model="filter.fileChoice" :options="filterFilesChoices" buttons></b-form-radio-group>
                     <div></div>
                     <div v-for="(file, idx) in filteredFiles" v-b-modal.info-modal @click="genModal('file', file)"  class="inline-block mr-2 px-2 border mt-3 e-file" :key="(file, idx)">
                        {{ file }}
                     </div>
                  </b-card-text>
               </b-tab>
               <b-tab title="Properties">
                  <b-card-text>
                     <b-input placeholder="Search for a property..." class="w-50 mb-2 inline-block" v-model="propSearch"> ></b-input>
                     <div></div>
                     <div v-for="(prop, idx) in filteredProperties" v-b-modal.info-modal @click="genModal('prop', prop)" class="inline-block mr-2 px-2 border mt-3 e-file" :key="(prop, idx)">
                      <span>{{ prop }}</span>
                     </div>
                  </b-card-text>
               </b-tab>
            </b-tabs>
        </div>
     </div>
      <b-modal id="info-modal" :title="modal.key" size="md">
         <div v-if="modal.type == 'prop'">
             <span class="font-weight-bold">{{ modal.key }}</span> appears in:
             <div class="mb-2"></div>
             <div>
               <div class="block" v-for="(file, idx) in modal.property.files" :key="(file, idx)">
                  {{ file }}
               </div>
             </div>
         </div>
         <div v-if="modal.type == 'file'">
            <div class="mb-2">
               <div>
                  <div v-for="(prop, idx) in Object.keys(modal.file.properties)" :key="(prop, idx)">
                     {{ prop }} = {{ modal.file.properties[prop] }}
                  </div>
               </div>
            </div>
         </div>
      </b-modal>
  </div>
</template>

<script>

import apiService from '../../apiService';
import compareEnvironments from './CompareEnvironments';

export default {

   name: 'profile-view-page',
   components: {
      "compareEnvironments": compareEnvironments
   },

   data(){
      return{
         envName: this.$route.params.id,
         fileSearch: '',
         propSearch: '',
         overview: {
            numFiles: 0,
            numProps: 0,
            allProps: {},
            propertiesMissing: [],
            fileNames: [],
            fileNamesMissing: [],
         },
         filter: {
            fileChoice: 'configured'
         },
         tab: 'overview',
         filterFilesChoices: [
            { text: "Configured", value: "configured" },
            { text: "Missing", value: "missing" }
         ],
         modal: {
            key: '',
            type: '',
            file: {
               properties: {}
            },
            property: {
               files: []
            }
         }
      }
   },

   mounted(){
      this.fillData()
   },

   methods: {

      async fillData()
      {
         // Invalid id, redirect
         if (!((await apiService.getEnvs(this.$store.state.application, this.$store.state.branchSelection)).data.includes(this.envName.toLowerCase()))) this.$router.back()
         this.overview = await apiService.getConfiguredFiles(this.$store.state.application, this.$store.state.branchSelection, this.envName)
      },

      // Used for random stuff on files
      randNum(max){
         return Math.floor((Math.random() * (max- 1)))
      },

      // Get properties for modal
      async genModal(type, key){
         this.modal.key = key;
         this.modal.type = type;

         if(type == 'prop'){
            this.modal.property.files = [...this.overview.allProps[key]];
         }  else{
            this.modal.file.properties = await apiService.getPropertiesByFileAndEnv({
               app: this.$store.state.application,
               branch: this.$store.state.branchSelection,
               env: this.envName,
               file: key
            })
         }
      }
   },

   computed: {

      appWatch(){ return this.$store.state.application },
      branchWatch(){ return this.$store.state.branchSelection },

      // Random stuff for overview tab
      randFiles(){
         return [this.overview.fileNames[this.randNum(this.overview.numFiles)], this.overview.fileNames[this.randNum(this.overview.numFiles)]]
      },

      randMissingFiles(){
         return [this.overview.fileNamesMissing[this.randNum(this.overview.missingFiles)], this.overview.fileNamesMissing[this.randNum(this.overview.missingFiles)]]
      },

      randProps(){
         var propKeys = Object.keys(this.overview.allProps);
         return [propKeys[this.randNum(propKeys.length)], propKeys[this.randNum(propKeys.length)]]
      },

      // Filtered files (so you can search)
      filteredFiles(){
         return (this.filter.fileChoice == 'missing' ? this.overview.fileNamesMissing : this.overview.fileNames)
                .filter(file => file.toLowerCase().match(this.fileSearch.toLowerCase()))
      },

      // Filtered properties (so you can search)
      filteredProperties(){
         return Object.keys(this.overview.allProps).filter(prop => prop.toLowerCase().match(this.propSearch.toLowerCase()))
      }
   },

   watch: {
      appWatch(){ this.fillData() },
      branchWatch() { this.fillData }
   }
}
</script>

<style>


   .menu-footer{
      position: fixed;
      padding-bottom: 20px;
      bottom: 0;
      width: 100%;
      max-width: 1600px;
      padding: 20px 20px 20px 20px;
   }

   .report{
      margin-top: 45px;
   }

   .vue-radial-menu-container{
      padding-bottom: 7px;
   }

   .e-file{
      user-select: none;
      cursor: pointer;
      font-weight: 600;
   }

   #ProfileView .form-control{
      display:inline-block;
   }

   .e-file:hover{
      transform: scale(1.05);
   }

   .cbod{
      font-weight: 600;
      font-size: 25px;
      padding-right: 100px;
   }

   #ProfileView li a{
      border-radius: 0;
      border-bottom: 2px solid rgb(71, 71, 71);
      font-weight: 600;
   }


   .file-preview{
      font-size: 12px;
      font-weight:600
   }

   #ProfileView h4{
      border-bottom: none;
   }

   #ProfileView .nav-pills .nav-link.active, .nav-pills .show > .nav-link {
      color: rgb(0, 0, 0);
      font-weight: 600;
      background-color: #acff99;
   }

   #ProfileView a:hover{
      color: rgb(0, 0, 0);
   }

</style>