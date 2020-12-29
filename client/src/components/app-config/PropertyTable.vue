<template>
   <div class="myTable">
      <h5 class="ml-2 inline-block"> {{ objKey}} </h5>
      <b-icon class="ml-2 h4 mb-0 hov inline-block" :icon="!showArrow ? 'arrow-right' : 'arrow-down'" @click="showArrow = !showArrow"></b-icon>
      <transition name="slide" :set="td = tableData">
         <v-client-table
         v-if="showArrow"
         :data="td == null ? [] : td.data"
         :columns="td == null ? [] : td.cols"
         :options="tableOptions(envs, branches, td.cols)"
         :name="objKey"
         >
            <div slot="afterFilter">
               <label class="ml-2 show-label">Show: </label>
               <b-form-radio-group
               :options="showOptions"
               buttons
               @change.native="filterDiff($event.target.value, objKey)"
               checked="all"
               value="all"
               class="ml-3"
               button-variant="outline-secondary"
               ></b-form-radio-group>
               <vue-excel-xlsx
                  :set="excel = formatExcel(td.data, td.cols)"
                  :data="excel.data"
                  :columns="excel.columns"
                  :filename="objKey"
                  :sheetname="'sheetname'"
                  class="btn btn-secondary ml-3"
               >
                xlsx <b-icon icon="download"></b-icon>
               </vue-excel-xlsx>
            </div>
         </v-client-table>
      </transition>
   </div>
</template>

<script>

import apiService from '../../apiService';

export default {

   name: 'property-table',
   props: ['envs', 'branches', 'objKey', 'choice'],

   data(){
      return{
         showOptions: [
            { text: 'All', value: 'all' },
            { text: 'Same', value: 'same' },
            { text: 'Diff', value: 'diff' }
         ],
         showArrow: true
      }
   },

   methods: {

      // Puts data into a form that can be read by vue-excel-xlsx package (it's a little weird, see docs for examples)
      formatExcel(table_data, table_columns){
         var columns = [];

         table_columns.forEach(col => {
            columns.push({
               label: col,
               field: col
            })
         })

         return{
            data: table_data,
            columns: columns
         }
      },

      // Updates the vuetable with custom filter, calls the 'git' filter method on the customFilters 
      filterDiff(choice, tableName){
         vtEvent.$emit(`vue-tables.${tableName}.filter::git`, choice);
      },

      tableOptions(envs, branches, columns) {

         var tableOptions = {
            filterable: true,
            filterByColumns: true,
            columnsDropdown: false,
            footerHeadings: false,
            perPage: 25,
            sortable: [''],
            resizableColumns: false,
            cellClasses: {},
            customFilters: [
               {
               // Custom filter
               name: 'git',
               // Callback function to execute 
               callback: (row, query) => {
                  // User wants to see all, don't apply any filter
                  if (query == 'all' || branches.length == 0){
                     return true;
                  } else {
                     // Figure out which cells to keep
                     var hasDiff = false;
                     var keys = []
                     var toSkip = this.envs.length;

                     for (var col in row) keys.push(col)
                     
                     for(let i = 1; i < keys.length - toSkip; i++){
                        if (row[keys[i]] != row[keys[i + toSkip]]){
                           hasDiff = true;
                           break;
                        } 
                     }
                     if(query == 'same') return !hasDiff
                     else return hasDiff
                  }
               }
            }
         ]};
         
         // Generate column classes
         if(branches.length > 0){
         
            // Don't apply cell classes to branch you're comparing from
            var startColumn = envs.length + 1;

            //Keep track of the branch you're on for comparison
            var goBack = 1;

            for(let i = startColumn; i < columns.length; i++){
               goBack = (i == startColumn + envs.length) ? (goBack + 1) : goBack // Make sure were comparing the correct columns
               let goBacki = goBack;
               tableOptions["cellClasses"][columns[i]] = [];
               tableOptions["cellClasses"][columns[i]].push({
                  class: 'same',
                  condition: row => { return row[columns[i]] == row[columns[i - (goBacki * envs.length)]]; } // Add condition
               });
               tableOptions["cellClasses"][columns[i]].push({
                  class: 'notSame',
                  condition: row => { 
                     var isNotSame = row[columns[i]] != row[columns[i - (goBacki * envs.length)]];
                     return isNotSame; // Add condition
                  }
               })
            }
         }
         return tableOptions;
      }
   },

   asyncComputed: {
      // Gets table for vue-tables-2 (api handles all formatting)
      tableData: {
         async get(){
            var td = await apiService.getCompareTableData({
               envs: this.envs, 
               branches: this.branches, 
               app: this.$store.state.application,
               key: this.objKey,
               choice: this.choice
            });
            return td.data;
         }
      }
   },
}
</script>

<style>

   .slide-leave-active {
      -moz-transition-duration: 0.3s;
      -webkit-transition-duration: 0.3s;
      -o-transition-duration: 0.3s;
      transition-duration: 0.5s;
      -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
      transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   }

   .slide-enter-to, .slide-leave {
      max-height: 100px;
      overflow: hidden;
   }

   .slide-enter, .slide-leave-to {
      overflow: hidden;
      max-height: 0;
   }

   .show-label{
      padding-right: 40%;
   }

   .myTable{
      background-color: rgb(250, 250, 250);
      border: 1px solid  rgb(206, 203, 203);
      padding: 10px 10px 10px;
      padding-top: 15px;
      border-radius: 10px;
      margin-bottom: 25px;
   }

</style>