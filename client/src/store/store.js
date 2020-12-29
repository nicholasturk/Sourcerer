import Vue from 'vue';
import Vuex from 'vuex';
import apiService from '../apiService';

Vue.use(Vuex);

export const store = new Vuex.Store({

   //Global data
   state: {
      jsonObject: {},
      branchChoices: [],
      branchesToCompare: [],
      branchSelection: 'HEAD.json',
      application: 'pc',
      settings: {
         colorMode: 'light'
      }
   },
   
   //All mutations are done through actions for proper vue flow
   mutations: {

      getBranchChoices(state, branchChoices){
         state.branchChoices = branchChoices;
      },

      changeBranchesToCompare(state, branchesToCompare){
         state.branchesToCompare = branchesToCompare;
      }
   },

   actions: {

      //Gets all branch choices (fileNames) from the specified directory
      async getBranchChoices(context, branches) {
         context.commit('getBranchChoices', branches);
      },

      //Updated the currently selected branch that reflects the entire program
      async changeBranch(context, opts) {
         var result = await apiService.getJsonObject(opts);
         context.commit('changeBranch', result);
      },

      //Updates the branches to compare (an array) to grab the other json files available and load them into memory
      async compareBranches(context, opts){
         var result = []
         opts.branchesToCompare.forEach(async branch => {
            var temp = await apiService.getJsonObject({app: opts.app, branch: branch});
            result.push({ name: branch, obj: temp });
         });
         context.commit('changeBranchesToCompare', result);
      }
   }
});

