<template>
   <div id="ini">
      <div class="disp">
         <h4 class="pb-2 mb-3">Select <b-button class="float-right" variant="danger" size="sm" @click="reset()">Reset</b-button> </h4>
         <div class="mb-3">
            <div class="mr-2 ml-1 inline-block as-lab">Configure per: </div>
            <b-form-radio-group
            id="btn-radios-1"
            :options="configureOptions"
            v-model="configureChoice"
            button-variant="outline-secondary"
            buttons
            ></b-form-radio-group>
         </div>
         <div class="ind-filter" v-if="configureChoice == 'single'">
            <multiselect :searchable="true" v-model="app" :options="options.apps" placeholder="Select application..."></multiselect>
            <multiselect :searchable="true" v-model="env" :options="options.envs" placeholder="Select environment..."></multiselect>
         </div>
         <div class="all-filter" v-else>
            <multiselect :searchable="true" v-model="app" :options="options.apps" placeholder="Select application..."></multiselect>
            <div class="keys" v-if="app != ''">
               <div class="ml-1 as-lab">Keys: </div>
               <b-row class="mt-1 pl-3 pr-3">
                  <b-col class="key-column pt-2 pl-0 pr-0 pb-2" v-for="(cat, idx) in Object.keys(appKeys)" :key="(cat, idx)">
                     <div class="key-header mb-2">
                        {{ cat.toUpperCase() }}
                     </div>
                     <div v-for="(k, idx) in appKeys[cat]" :key="(k, idx)" class="key pl-2 pr-2">
                        <span> {{ k }} </span>
                        <b-icon @click="deleteKey(k)" icon="trash" class="mt-1"></b-icon>
                     </div>
                  </b-col>
               </b-row>
            </div>
            <div class="add-key mt-2" v-if="app != ''">
               <b-input-group prepend="Add key/value: ">
                  <b-form-input v-model="keyToAdd" placeholder="Key"></b-form-input>
                  <b-form-input v-model="keyToAddValue" placeholder="Value (default = 'None')"></b-form-input>
                  <b-input-group-append>
                     <b-button @click="addKey()" variant="outline-success"><b-icon icon="check"></b-icon></b-button>
                  </b-input-group-append>
               </b-input-group>
            </div>
            <div class="changes mt-4" v-if="app != '' && app != null">
               <div class="as-lab">
                  <span style="margin-right: 20px">Adding: </span>
                  <span class="mod-key add" v-for="(addKey, idx) in bulk.keysToAdd" :key="(addKey, idx)" @click="undoAddKey(addKey.key)"> {{ addKey.key + ' = ' + addKey.value }} <b-icon icon="x"></b-icon></span>  
               </div>
               <div class="as-lab mt-3">
                  <span class="mr-3">Deleting:</span>
                  <span class="mod-key del" v-for="(delKey, idx) in bulk.keysToRem" :key="(delKey, idx)" @click="undoDel(delKey)"> {{ delKey }} <b-icon icon="x"></b-icon></span> 
               </div>
            </div>
            <div class="buttons" v-if="bulk.keysToAdd.length > 0 || bulk.keysToRem.length > 0">
               <div class="fr pc">
                  <b-button size="sm" v-b-modal.bulk-commit>Preview changes</b-button>
               </div>
            </div>
            <div>
               &nbsp;
            </div>
         </div>
      </div>
      <div class="disp mt-5" v-if="singleData && configureChoice=='single'">
         <div class="myTable" v-if="undo">
            <h4> {{ document.application }} -  {{ document.environment }} </h4>
            <v-client-table
            :data="singleData.data"
            :columns="singleData.columns"
            :options="singleData.options"
            ref="singleTable"
            >
               <div slot="afterFilter">
                  <div class="commit mt-4 float-right" v-if="documentChanges.length > 0">
                     <b-button variant="success ml-3" v-b-modal.commit-modal>Preview changes</b-button>
                     <b-button variant="danger ml-3" @click="revert()">Reset</b-button>
                  </div>
               </div>
               <div slot="Value" slot-scope="{row, update, setEditing, isEditing, revertValue}">
                  <span v-if="!isEditing()">
                  {{row.Value}}
                  <b-icon icon="hammer" @click="setEditing(true)" class="float-right h5"></b-icon>
                  </span>
                  <span v-else>
                     <b-input-group>
                        <b-form-input v-model="row.Value"></b-form-input>
                        <b-input-group-append>
                        <b-button size="sm" variant="success" @click="update(row.Value); updateDocument(row); setEditing(false)">Save</b-button>
                        <b-button size="sm" variant="danger" @click="revertValue(); setEditing(false)">Undo</b-button>
                        </b-input-group-append>
                     </b-input-group>        
                  </span>  
               </div>          
            </v-client-table>
         </div>
      </div>
      <b-modal id="commit-modal" size="lg" title="Here's what you changed:">
         <div v-for="(change, idx) in documentChanges" class="mb-1 my-2 modal-change" :key="(change, idx)">
            <span>{{ change.property }}: </span>
            <span style="color: red;"> {{ change.old }} => </span>
            <span style="color: green;"> {{ change.new }} </span>
         </div>
         <template #modal-footer=" { close, ok } ">
            <b-button @click="close()" size="sm" variant="danger">Back</b-button>
            <b-button @click="ok(); commitChanges();" size="sm" variant="success">Commit changes</b-button>
         </template>
      </b-modal>
      <b-modal id="bulk-commit" size="lg" title="Here's what you're applying:">
         <div v-if="bulk.keysToAdd.length > 0">
            <span>Adding to all environments in <span style="font-weight: bold;">{{ app }}:</span></span>
            <div class="ml-2" v-for="(add, idx) in bulk.keysToAdd" :key="(add, idx)">
               <div>Key: <span style="color: green;" class="bold">{{ add.key }} </span>= Value:  <span style="color: green;" class="bold">{{ add.value }}</span></div>
            </div>
         </div>
         <div v-if="bulk.keysToRem.length > 0" class="mt-3">
            <span>Removing from all environments in <span style="font-weight: bold;">{{ app }}:</span></span>
            <div class="ml-2" v-for="(rem, idx) in bulk.keysToRem" :key="(rem, idx)">
               <div>Key: <span style="color: red;"> {{ rem }} </span> </div>
            </div>
         </div>
         <template #modal-footer=" { close, ok } ">
            <b-button @click="close()" size="sm" variant="danger">Back</b-button>
            <b-button @click="ok(); commitBulkChanges();" size="sm" variant="success">Commit changes</b-button>
         </template>
      </b-modal>
   </div>
</template>

<script>

import apiService from '../../apiService';

export default {

   name: 'config-ini',

   data(){
      return {
         options: {
            apps: [],
            envs: []
         },
         bulk: {
            allKeys: [],
            keysToAdd: [],
            keysToRem: [],
            editAll: []
         },
         selected: {
            envs: []
         },
         keyToAdd: '',
         keyToAddValue: '',
         app: '',
         env: '',
         undo: true,
         document: {},
         updatedDocument: {},
         configureOptions: [
            { text: "Environment", value: "single" },
            { text: "Application", value: "all" }
         ],
         configureChoice: 'single',
      }
   },

   // Get application from ini collection in mongo
   async mounted(){
      this.options.apps = await apiService.getApps();
   },

   methods: {

      // Push changes to database
      async commitBulkChanges(){
         apiService.updateApplication({
            add: this.bulk.keysToAdd,
            rem: this.bulk.keysToRem,
            envs: this.selected.envs,
            app: this.app
         })
         this.reset();
      },

      addKey(){

         // Check if key has already exists in application keys, if so return
         for(var i = 0; i < this.bulk.allKeys.length; i++){
            if (this.bulk.allKeys[i].toLowerCase() == this.keyToAdd.toLowerCase()){
               alert('That key already exists!')
               return;
            }
         }

         // Check if they're already adding that key, if so return
         for(var i = 0; i < this.bulk.keysToAdd.length; i++){
            if (this.bulk.keysToAdd[i].key.toLowerCase() == this.keyToAdd.toLowerCase()){
               alert('You\'re already adding that key!')
               return;
            }
         }

         // Push key, check if it has value, if not add 'None'
         this.bulk.keysToAdd.push({
            key: this.keyToAdd,
            value: this.keyToAddValue == '' ? 'None' : this.keyToAddValue
         })

         this.keysToAdd = '',
         this.keyToAddValue = ''
      },

      // Remove key to add
      undoAddKey(keyName){
         this.bulk.keysToAdd.forEach((k, idx) => {
            if(k.key == keyName){
               this.bulk.keysToAdd.splice(idx, 1);
            }
         })
      },

      // Remove key to remove
      undoDel(keyName){
         this.bulk.allKeys.push(keyName)
         this.bulk.keysToRem.splice(this.bulk.keysToRem.indexOf(keyName), 1);
      },

      // Add key to remvoe
      deleteKey(keyName){
         this.bulk.allKeys.splice(this.bulk.allKeys.indexOf(keyName), 1);
         this.bulk.keysToRem.push(keyName)
      },

      // Update environments based on new app selection
      async updateEnvs(){
         this.options.envs = await apiService.getEnvsByApp(this.app);
      },

      reset(){

         this.selected.envs.forEach(env => {
            this.selected.envs.pop()
         })

         this.bulk.keysToAdd.forEach(k => { this.bulk.keysToAdd.pop() });
         this.bulk.keysToAdd = []
         this.bulk.keysToRem.forEach(k => { this.bulk.keysToRem.pop() });
         this.bulk.keysToRem = []
         this.selected.envs = []

         this.env = ''
         this.app = ''
      },

      // Revert document back to old document (discard all changes)
      revert(){

         this.updatedDocument = {...this.document}

         this.undo = false;
         this.$nextTick(() => {
            this.undo = true;
         })
      },

      // Update document
      updateDocument(row){
         this.updatedDocument[row.Key] = row.Value
      },

      // Update changes to database
      async commitChanges(){
         apiService.updateIniDocument(this.updatedDocument);
         this.document = {...this.updatedDocument}
      }
      
   },

   watch: {
      async app(){
         this.env = ''
         if (this.app == '') this.options.envs = []
         else this.options.envs = await apiService.getEnvsByApp(this.app);

         if(this.configureChoice == 'all' && this.app != ''){
            this.document = await apiService.configSingleObject(this.app, this.cEnvs[0]);
            this.bulk.allKeys = Object.keys(this.document).filter(item => item != "_id" && item != "application" && item !="environment");
         }
      },

      async configureChoice(){

         if(this.configureChoice == 'all' && this.app != ''){
            this.document = await apiService.configSingleObject(this.app, this.cEnvs[0]);
            this.bulk.allKeys = Object.keys(this.document).filter(item => item != "_id" && item != "application" && item !="environment");
         }

         if(this.configureChoice == 'single'){
            this.reset();
         }
      },
   },

   computed: {

      cEnvs(){
         return this.options.envs;
      },

      appKeys(){

         if (this.bulk.allKeys.length == 0 || this.app == '') return []

         var seperation = {
            tomcat: [],
            birt: [],
            broker: [],
            database: [],
            onbase: [],
            other: []
         };

         this.bulk.allKeys = this.bulk.allKeys.filter(item => item != "_id" && item != "application" && item !="environment");

         // Push keys into categories
         this.bulk.allKeys.forEach(k => {
            var tempK = k.toLowerCase();
            if(tempK.startsWith('tomcat')) seperation.tomcat.push(k)
            else if(tempK.startsWith('birt')) seperation.birt.push(k)
            else if(tempK.startsWith('broker')) seperation.broker.push(k)
            else if(tempK.startsWith('database')) seperation.database.push(k)
            else if(tempK.startsWith('onbase')) seperation.onbase.push(k)
            else seperation.other.push(k)
         });

         return seperation;

      },

      documentChanges(){
         var changes = []
         Object.keys(this.document).forEach(k => {
            if (this.document[k] != this.updatedDocument[k]) changes.push({ property: k, old: this.document[k], new: this.updatedDocument[k] })
         })
         return changes;
      }
   },

   asyncComputed: {
      singleData: {
         async get(){

            if(this.env == '' || this.app == '') return false;

            this.document = await apiService.configSingleObject(this.app, this.env);
            this.updatedDocument = {...this.document}

            var objKeys = Object.keys(this.document).filter(item => item != "_id" && item != "application" && item !="environment");
            var data = [];
            var columns = ["id", "Key", "Value"];

            objKeys.forEach((objKey, idx) => {
               data.push({
                  id: idx,
                  Key: objKey,
                  Value: this.document[objKey]
               })
            })

            var options = {
               perPage: 50,
               editableColumns: ["Value"],
               hiddenColumns: ["id"],
               uniqueKey: "id",
               perPageValues: [],
               sortable: [''],
               pagination: {
                  show: false
               },
               cellClasses: {
                  "Value": [
                     {
                        class: 'changed',
                        condition: row => { return this.document[row.Key] != this.updatedDocument[row.Key] }
                     }
                  ]
               }  
            }

            return {
               data,
               columns,
               options
            }
            
         }
      }
   }

}

</script>

<style>

   .modal-change{
      border-bottom: 1px dotted rgb(173, 167, 167);
      font-weight: bold;
   }

   .bold{
      font-weight: bold;
   }

   .key-column{
      border: 1px solid lightgray;
      min-height: 350px;
   }

   #ini .mod-key .bi-arrow-counterclockwise:hover{
      transform: scale(1.0);
   }

   .key-header{
      text-align: center;
      color: black;
      font-size: 20px;
      border-bottom: 2px solid lightgray;
   }

   .buttons{
      height: 30px;
   }

   .add-key{
      width: 70%;
   }

   .key{
      border-bottom: 1px solid lightgray;
      font-size: 14px;
   }

   #ini .b-icon:hover{
      transition: 0.2s;
      transform: scale(1.2);
      cursor: pointer;
   }

   #ini td{
      max-width: 50px;
   }

   .key .b-icon{
      float: right;
   }

   .as-lab{
      font-size: 16px;
      font-weight: 500;
   }

   .del{
      background-color: rgb(243, 92, 92);
   }

   .add{
      background-color: rgba(8, 153, 39, 0.781);
   }

   .mod-key{
      font-size: 14px;
      color: white;
      margin-right: 5px;
      padding: 4px 5px 5px 5px;
      display: inline-block;
      border-radius: 5px;
      cursor: pointer;
      user-select: none;
   }


   .mod-key:hover{
      transition: 0.3s;
      transform: scale(1.04);
   }

   .mlab{
      font-weight:500;
   }

   #ini{
      padding: 20px 20px 20px 20px;
   }

   .changed{
      background-color: lightpink;
   }

   .fr{
      float: right;
   }

</style>