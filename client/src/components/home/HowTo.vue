<template>
   <div id="how-to">
      <b-row class="align-items-stretch mt-3 disp pt-4">
         <b-col v-for="(item, idx) in articleItems" :key="(item, idx)" lg="12" class="mb-4">
           <h5 class="border-bottom"> {{ item.title }} <b-icon class="cp" :icon="item.show ? 'arrow-down' : 'arrow-right'" @click="item.show = !item.show"></b-icon> </h5>
            <b-row v-if="item.show">
               <b-col lg="3">
                  <b-card class="h-100" bg-variant="light" :header="item.title">
                     <ol>
                        <li class="mb-0" v-for="(step, idx) in item.steps" :key="(step, idx)">
                           <p class="mb-1" v-html="step"></p>
                        </li>
                     </ol>
                  </b-card>
               </b-col>
               <b-col lg="9">
                  <img class="w-100" :src="getImageUrl(item.image)" alt="" />
               </b-col>
            </b-row>
         </b-col>
      </b-row>
   </div>
</template>

<script>
export default {
   data() {
      return {
        articleSearch: '',
         articleItems: [
            {
               title: "Get latest code",
               show: false,
               image: "how_to_get_latest_code.gif",
               steps: {
                  1: "Visit <a class='how-to-link' href='/home/settings'>settings<a>",
                  2: "Click 'commit' under update branches from artifactory",
                  3: "You should see a large green success message",
               },
            },
            {
               title: "Compare environment configurations between branches",
               image: "compare_env_configs_vs_branch.gif",
               show: false,
               steps: {
                  1: "Go to <a class='how-to-link' href='/app-config-xml/table-builder'>table builder</a>",
                  2: "Choose branch in the top right (head or mlt)",
                  3: "Select environments with the multiselect bar",
                  4: "Select application configuration files from the multiselect bar",
                  5: "Wait for table to render",
               },
            },
            {
               title: "Look at all configurations for a single environment in a single branch",
               image: "all_configs_per_env.gif",
               show: false,
               steps: {
                  1: "Go to <a class='how-to-link' href='/profile-view/select'>profile-view</a>",
                  2: "Select desired environment",
                  3: "Select the 'applications' tab, and on the right make sure the configured button is selected. This will show you all the configuration files where that environments is tagged",
                  4: "To see missing, select the missing button. This will show you where that environment is missing.",
               },
            },
            {
               title: "Compare all configurations between two environments",
               image: "compare_devvsdev4.gif",
               show: false,
               steps: {
                  1: "Go to <a class='how-to-link' href='/profile-view/select'>profile-view</a>",
                  2: "Select an environment",
                  3: "Click the compare tab",
                  4: "Choose environment to compare",
                  5: "The comparison will render and give you information about those two environments",
               },
            },
            {
               title: "Compare a property configuration against all environments",
               image: "compprop.gif",
               show: false,
               steps: {
                  1: "The easiest way is to go to <a class='how-to-link' href='/app-config-xml/search'>search.</a>",
                  2: "Select for a property",
                  3: "Wait for it to load (it takes a second)",
                  4: "Click the property name",
                  5: "You can filter the table by environment to quickly see the value.",
               },
            },
            {
               title: "Where is what environment tag compared to others?",
               image: "excel_env_all.gif",
               show: false,
               steps: {
                  1: "Go to <a class='how-to-link' href='/profile-view/select'>select</a> to choose an environment.",
                  2: "Click on the 'compare tab'",
                  3: "Choose the environments to compare against.",
                  4: "You will be presented with a list of statistics, if you're curious about other intersections (where dev, dev2 and prod are all tagged), click the xlsx download button, choose you're desired intersections, and click donwload. ",
                  5: "If you followed step 4, open the sheet and you can now filter your data with true or false to see the intersections.",
               },
            }
         ],
      };
   },

   methods: {
      getImageUrl(pic) {
         return require(`../../assets/how_to/${pic}`);
      },
   },

   computed: {
     articleItemsFiltered(){
       
     }
   }

};
</script>

<style>

#how-to{
  padding: 20px;
}

.card-header {
   text-align: center;
   font-weight: 600;
   font-size: 20px;
}

.cp{
  cursor: pointer;
}

.how-to-link {
   color: blue;
}
</style>
