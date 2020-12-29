<template>
   <div id="results" class="mt-4">
      <div v-for="matchKey in Object.keys(result.items)" :key="matchKey" class="result">
         <h5 class="inline-block table-link" @click="genTable(matchKey)" v-b-modal.table-modal> {{ matchKey }} </h5>
         <div class="subinfo">type of: <span class="highlight">{{ result.items[matchKey][0].foundOn == "@value" ? "PROPERTY VALUE" : "PROPERTY NAME" }}</span></div>
         <div class="subinfo">found in: {{ numFiles(matchKey) }} files</div>
      </div>
      <b-modal id="table-modal" size="lg">
         <div class="myTable mt-3" v-if="table.cols.length > 0">
            <h4>
               <span v-if="table.foundOn == 'Property name'"> 
                  <span class="highlight"> {{ table.foundOn }} </span> 
                  "{{ table.header }}" 
                  <span v-if="table.against != ''"> associated with property name "{{ table.against }}"</span> 
               </span>
               <span v-else>
                  {{ table.foundOn }} <span class="highlight"> "{{ table.header }}" </span> is found in:
               </span>
            </h4>
            <v-client-table
            :columns="table.cols"
            :data="table.data"
            ></v-client-table>
         </div>
      </b-modal>
   </div>
</template>

<script>
export default {

  props: ["result"],

  data(){
     return{
        columns: ['Environment', 'Value', 'File'],
        table: {
           data: [],
           cols: [],
           header: '',
           foundOn: ''
        }
     }
  },

   methods: {

      clearData(){
         this.table.data.forEach(row => { this.table.data.pop() })
         this.table.data = []
         this.table.cols.forEach(row => { this.table.cols.pop() })
         this.table.cols = []
      },

      // Generates table from click
      genTable(matchKey){

         // Remove previous data
         this.clearData()

         this.table.header = matchKey
         this.table.foundOn = this.result.items[matchKey][0].foundOn == "@name" ? "Property name" : "Value"
         this.table.against = this.result.items[matchKey][0].foundOn == "@name" ? "" : this.result.items[matchKey][0].choice["@value"]

         var files = new Set()
         var envs = new Set();

         // Get all filenames
         this.result.items[matchKey].forEach(item => {
            var fileName = item.choice["file"].replace(/\./g,' ')
            files.add(fileName);
            envs.add(item.choice.env);

         });

         // Add all columns
         this.table.cols = ["Environment"]
         files.forEach(file => { this.table.cols.push(file) })

         // Build table rows
         var temp = {};
         envs.forEach(env => {
            temp = {};
            temp["Environment"] = env;
            files.forEach(file => {
               for(var i = 0; i < this.result.items[matchKey].length; i++){
                  var obj = this.result.items[matchKey][i];
                  if (obj.choice.env == env){
                     var fileName = obj.choice.file.replace(/\./g,' ')
                     temp[fileName] = obj.foundOn == "@name" ? obj.choice["@value"] : obj.choice["@name"];
                  } 
               }
            })
            this.table.data.push(temp);
         })
      },

      // Method to get the number of files matchkey was found in
      numFiles(matchKey){
         var files = new Set();
         this.result.items[matchKey].forEach(item => { files.add(item.choice["file"]) })
         return Array.from(files).length;
      }
   }

   }
</script>

<style scoped>

   .match{
      font-weight: bold;
      font-size: 1.2em;
      color: green;
   }

   .table-link{
      color: rgb(26, 13, 171);
      cursor: pointer;
      height: 23px;
   }

   .table-link:hover{
      border-bottom: 1px solid rgb(26, 13, 171); 
   }

   span{
      font-weight: bold;
   }

   .result{
      font-size: 20px;
      margin-top: 10px;
   }

   .subinfo{
      font-size: 15px;
      padding-left: 20px;
   }

</style>