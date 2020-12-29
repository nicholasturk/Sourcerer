<template>
   <div id="header">
      <b-navbar type="dark" variant="dark">
         <b-navbar-nav>
            <b-nav-item>
               <div class="sourcerer-header mb-1">
                 <router-link to="/home/how-to"><div class="inline-block title pb-0"><b-icon class="mr-2" icon="files"></b-icon>Sourcerer</div></router-link>
               </div>
            </b-nav-item>
            <b-nav-item class="pt-2 ml-3" to="/home/how-to" :active="watchActive == 'home'">Home</b-nav-item>
            <b-nav-item class="pt-2 ml-3" to="/profile-view/select" :active="watchActive == 'profile-view'">Profile-view</b-nav-item>
            <b-nav-item class="pt-2 ml-3" to="/app-config-xml/search" :active="watchActive == 'app-config-xml'">Application Configurations</b-nav-item>
            <b-nav-item class="pt-2 ml-3" to="/external-configurations/configure" :active="watchActive == 'external-configurations'">External Configurations</b-nav-item>
         </b-navbar-nav>
         <b-navbar-nav class="ml-auto mr-4">
            <div class="nav-inp-group">
               <div @click="$store.state.application = 'pc'" :class="{ 'app-active ac-green': $store.state.application == 'pc' }" class="my-rad inline-block">
                  PC
               </div>
               <div @click="$store.state.application = 'bc'" :class="{ 'app-active ac-green': $store.state.application == 'bc' }" class="my-rad inline-block">
                  BC
               </div>
            </div>
            <div class="nav-inp-group ml-3">
               <div @click="$store.state.branchSelection = 'HEAD.json'" :class="{ 'app-active ac-red': $store.state.branchSelection == 'HEAD.json' }" class="my-rad inline-block">
                  HEAD
               </div>
               <div @click="$store.state.branchSelection = 'MAINTENANCE_LONG_TERM.json'" :class="{ 'app-active ac-red': $store.state.branchSelection == 'MAINTENANCE_LONG_TERM.json' }" class="my-rad inline-block">
                  MLT
               </div>
            </div>
         </b-navbar-nav>
      </b-navbar>
   </div>
</template>

<script>

export default {

   name: 'app-header',

   computed: {
      watchActive(){
         return this.$route.path.split('/')[1]
      },
   }
}

</script>


<style>

   .sourcerer-header{
      color: white;
      font-size: 24px;
   }

   .imgbig{
      transform: scale(1.45);
   }

   .my-rad{
      cursor: pointer;
      color: rgb(209, 204, 204);
      padding-left: 5px;
      padding-right: 5px;
      font-family: monospace;
      font-size: 20px;
   }

   .nav-inp-group{
      border: 1px solid rgb(114, 111, 111);
      border-radius: 4px;
   }

   .api-link{
      color: rgb(157, 169, 172);
   }

   .ac-green{
      color: rgb(113, 243, 113);
   }

   .ac-red{
      color: rgb(233, 107, 107);
   }

   .app-active{
      transform: scale(1.05);
   }

   .title{
      color: white;
      user-select: none;
      cursor: pointer;
   }

</style>