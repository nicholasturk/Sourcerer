<template>
   <div id="statistics">
      <div class="file-chart mt-4">
         <line-chart 
         :chart-data="datacollection"
         :options="options"
         >
         </line-chart>
      </div>
   </div>
</template>

<script>

import apiService from '../../apiService'
import LineChart from '../../charts/LineChart'

export default {

   name: 'statistics',

   components: {
      LineChart
   },

   data () {
      return {
         loaded: false,
         datacollection: null,
         options: {
            responve: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true
                  }
               }]
            }
         }
      }
   },

   mounted () {
      this.fillData()
   },

   computed: {
      watchApp(){
         return this.$store.sta
      }
   },

   methods: {

      // Get data
      async fillData () {

         // Get all file data from backend (it's a good amount...), then sort it from low to high
         this.files = await apiService.getFileInfo(this.$store.state.application, this.$store.state.branchSelection.substring(0, this.$store.state.branchSelection.length - 5).toLowerCase());
         this.files.sort((a, b) => { return b.num_envs - a.num_envs });

         this.datacollection = {
            labels: [],
            datasets: []
         }

         var envsConfiguredSet = {
            backgroundColor: "#c6f4f5",
            label: "Envs configured",
            data: []
         }

         var envsMissingSet = {
            backgroundColor: "#f5ccc6",
            label: "Envs missing",
            data: []
         }

         var numPropertiesSet = {
            backgroundColor: "#f3f779",
            label: "Number of properties",
            data: []
         }

         this.files.forEach(file => { 
            this.datacollection.labels.push(file.file_name.replace(".xml", ""))
            envsConfiguredSet.data.push(file.num_envs) 
            envsMissingSet.data.push(file.missing_envs.length)
            numPropertiesSet.data.push(file.all_properties.length)
         })

         // Add the three lines to the data collection
         this.datacollection.datasets.push(envsConfiguredSet);
         this.datacollection.datasets.push(envsMissingSet);
         this.datacollection.datasets.push(numPropertiesSet);

      }
   }
}

</script>

<style>

</style>