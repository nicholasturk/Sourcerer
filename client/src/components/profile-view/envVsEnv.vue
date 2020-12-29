<template>
  <div id="envVsEnv">
    <h5 class="mb-3 border-bottom">vs  <span class="text-success">{{ compareName }}</span></h5>
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
</template>
<script>

import apiService from '../../apiService';

export default {

  props: ['primaryData', 'compareName', 'secondaryData', 'viewSelection'],

  data(){
    return{
      primaryName: this.$route.params.id,
      compareData: {
        "intersection_tagged": {
          "dispName": "Both tagged in",
          "show": false,
          "type": 'arr'
        },
        "intersection_missing": {
          "dispName": "Both missing in",
          "show": false,
          "type": 'arr'
        },
        "primary_found_tagged": {
          "dispName": `${this.compareName} is found / ${this.$route.params.id} is not`,
          "show": false,
          "type": 'arr'
        },
        "primary_missing_tagged": {
          "dispName": `${this.compareName} is missing / ${this.$route.params.id} is not`,
          "show": false,
          "type": 'arr'
        },
        "conflicting_properties": {
          "dispName": "Conflicting property values",
          "show": false
        }
      }
    }
  },

  async mounted(){
    await this.fillData()
  },

  methods: {

    async fillData(){
      await this.genCompareData();
    },

    // This is spaghetti code, but it works
    async genCompareData(){
      Object.keys(this.compareData).forEach(async section => {
        this.compareData[section].show = true;
        if(section == 'intersection_tagged'){
            this.compareData.intersection_tagged["items"] = _.intersection(this.primaryData.fileNames, this.secondaryData.fileNames)
            this.compareData.intersection_tagged["itemsLength"] = this.compareData.intersection_tagged["items"].length
            this.compareData[section].show = false;
        } else if(section == 'intersection_missing') {
            this.compareData.intersection_missing["items"] = _.intersection(this.primaryData.fileNamesMissing, this.secondaryData.fileNamesMissing)
            this.compareData.intersection_missing["itemsLength"] = this.compareData.intersection_missing["items"].length
            this.compareData[section].show = false;
        } else if(section == 'primary_found_tagged'){
            this.compareData.primary_found_tagged["items"] = _.difference(this.secondaryData.fileNames, this.primaryData.fileNames)
            this.compareData.primary_found_tagged["itemsLength"] = this.compareData.primary_found_tagged["items"].length
            this.compareData[section].show = false;
        } else if(section == 'primary_missing_tagged'){
            this.compareData.primary_missing_tagged["items"] = _.difference(this.secondaryData.fileNamesMissing, this.primaryData.fileNamesMissing)
            this.compareData.primary_missing_tagged["itemsLength"] = this.compareData.primary_missing_tagged["items"].length
            this.compareData[section].show = false;
        } else if(section == 'conflicting_properties'){
          this.compareData[section].show = false;
            this.compareData.conflicting_properties["items"] = await apiService.getConflictingProperties({
              app: this.$store.state.application,
              branch: this.$store.state.branchSelection,
              primaryEnv: this.primaryName,
              envsToComp: [this.compareName],
              filesToIgnore: this.compareData.intersection_missing.items
            });
        }
      })
    }
  },

}
</script>

<style>


.myic{
  cursor: pointer;
}

.myic:hover{
  transform: scale(1.1);
}

</style>