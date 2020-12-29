<template>
  <div id="envVsAll">
    <div>
      <h5 class="mb-3 border-bottom inline-block">vs  <span v-for="(env, idx) in filledData" :key="(env, idx)" class="text-success">{{ env }} / </span></h5>
      <b-button class="inline-block float-right" @click="genModal()">xlsx<b-icon class="ml-2" icon="download"></b-icon></b-button>
    </div>
    <div v-if="filledData.length > 0">
      <div class="env-comp-section mb-3 border-bottom" v-for="(section, idx) in Object.keys(compareData)" :key="(section, idx)">
        <h6> {{ compareData[section].dispName + (compareData[section].type == 'arr' ? '... (' + compareData[section].itemsLength + ')' : '') }} 
          <b-icon class="myic" :icon="compareData[section]['show'] == true ? 'arrow-down' : 'arrow-right'" @click="compareData[section]['show'] = !compareData[section]['show']">
          </b-icon>
        </h6>
        <div class="data" v-if="compareData[section].show && compareData[section].type == 'arr'">
          <div class="inline-block mr-2 px-2 border mt-1 mb-2 e-file" v-for="(item, idx2) in compareData[section].items" :key="(item, idx2)">
            {{ item }}
          </div>
        </div>
        <div class="conflicting_properties mt-3" v-if="compareData[section].show && section == 'conflicting_properties'">
            <b-row class="border-bottom mb-2">
              <b-col> <h5>File name</h5> </b-col>
              <b-col> <h5> {{ primaryName }} </h5> </b-col>
              <b-col> <h5> {{ compareName }} </h5> </b-col>
              <b-col> <h5> Conflict type </h5> </b-col>
            </b-row>
          <div v-for="(file, idx) in Object.keys(compareData[section].items[compareName])" :key="(file, idx)">
            <div class="mb-3" v-if="Object.keys(compareData[section].items[compareName][file]).length > 0">
              <h6 class="" lg="12">
                {{ file }}
              </h6>
              <b-row class="border-bottom border-top" v-for="(propName, idx2) in Object.keys(compareData[section].items[compareName][file])" :key="(propName, idx2)">
                <b-col>
                {{ propName }}
                </b-col>
                <b-col class="bgg bw">
                  {{ compareData[section].items[compareName][file][propName]["primValue"] }}
                </b-col>
                <b-col class="bgr bw">
                  {{ compareData[section].items[compareName][file][propName]["secValue"] }}
                </b-col>
                <b-col >
                  {{ compareData[section].items[compareName][file][propName]["conflictType"] }}
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal ref="download-modal" title="Comparison Report">
      <h5>Select intersections: </h5>
      <b-form-checkbox-group
        id="checkbox-group-1"
        class="a b c d e"
        v-model="selectedSubsets"
        :options="checkBoxOptions"
        name="flavour-1"
        stacked
      ></b-form-checkbox-group>
      <template #modal-footer=" { close } ">
        <b-button @click="close(); clearData()" size="sm" variant="secondary">Back</b-button>
        <b-button @click="downloadExcel();" size="sm" variant="success">Download</b-button>
      </template>
      <div class="images mt-3">
        <h5>How to filter your data on excel:</h5>
        <img src="../../assets/excel_filter/steps.png" alt="">
      </div>
    </b-modal>
  </div>
</template>

<script>

import apiService from '../../apiService';

export default {
  props: ['primaryName', 'primaryData', 'environmentsData', 'filledData'],

  data(){
    return{
      compareData: {
        "intersection_tagged": {
          "dispName": "All tagged in",
          "show": false,
          "type": 'arr'
        },
        "intersection_missing": {
          "dispName": "All missing in",
          "show": false,
          "type": 'arr'
        },
        "primary_found_tagged": {
          "dispName": `${this.$route.params.id} is tagged, others are not`,
          "show": false,
          "type": 'arr'
        }
      },
      subSets: [],
      checkBoxOptions: [],
      selectedSubsets: []
    }
  },

  mounted(){
    this.fillData()
  },

  methods: {

    clearData(){
      this.subSets.forEach(sub => this.subSets.pop())
      this.subSets = []
      this.checkBoxOptions.forEach(checkBoxOption => this.checkBoxOptions.pop())
      this.checkBoxOptions = []
      this.selectedSubsets.forEach(selectedSubset => this.selectedSubsets.pop())
      this.selectedSubsets = []
    },

    genModal(){

      if (this.filledData.length > 5) {
        alert('The maximum number you can select is 5!');
        return;
      }

      this.clearData();

      // Get all subsets
      var arr = [...this.filledData];
      arr.push(this.primaryName);
      this.subSets = this.getAllSubsets(arr);

      this.subSets.forEach(subSet => {
        this.checkBoxOptions.push({
          text: subSet.join("/"),
          value: [subSet]
        })
      })

      //Show modal
      this.$refs['download-modal'].show();
    },

    async downloadExcel(){

      if (this.selectedSubsets.length == 0){
        alert('Select atleast one subset!')
        return;
      }

      var data = this.environmentsData;
      data[this.primaryName] = this.primaryData;
      await apiService.envVsAllReport({
        data: data,
        selectedSubsets: this.selectedSubsets,
        application: this.$store.state.application,
        branch: this.$store.state.branchSelection,
      })
    },

    getAllSubsets(arr){
      var ret = arr.reduce((subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])), [[]]);
      for (let i = ret.length - 1; i >= 0; i--) if(ret[i].length <= 1) ret.splice(i, 1);
      return ret;
    },

    // Spaghetti code that works, just intersection stuff
    fillData(){
      Object.keys(this.compareData).forEach(section => {
        this.compareData[section].show = true;
        switch (section) {
          case 'intersection_tagged':
          case 'intersection_missing':
            var my_arrays = [];
            section == 'intersection_tagged' ? toScan = 'fileNames' : toScan = 'fileNamesMissing'
            my_arrays.push(this.primaryData[toScan])
            var toScan; 
            Object.keys(this.environmentsData).forEach(env => { my_arrays.push(this.environmentsData[env][toScan]) })
            this.compareData[section].items = _.intersection(...my_arrays) 
            this.compareData[section]["itemsLength"] = this.compareData[section]["items"].length
            this.compareData[section].show = false;
            break;
          case 'primary_found_tagged':
            var toScan = 'fileNames'
            var my_arrays = []
            Object.keys(this.environmentsData).forEach(env => { my_arrays.push(this.environmentsData[env][toScan]) })

            this.compareData[section].items =_.difference(this.primaryData.fileNames, ...my_arrays)                                                                            
            this.compareData[section]["itemsLength"] = this.compareData[section]["items"].length
            this.compareData[section].show = false

        }
      })
    }
  },

  // Filled data changed, fill data again with new envs  (if user adds dev3, need to recalculate everything... I know so sad.)
  watch: {
    filledData(){
      this.fillData();
    }
  }

}
</script>

<style>

.a.b .custom-control, .custom-checkbox.a.b{
  display: block !important;
}

</style>