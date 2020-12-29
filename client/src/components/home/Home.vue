<template>
   <div id="home">
      <div>
         <b-jumbotron class="hi" header="Sourcerer" header-level="4" lead="Configuration management tool">
            <hr class="my-4" />
            <b-button variant="success" class="mr-2" href="https://jira.cooperators.ca/servicedesk/customer/portal/18/create/398">Make a suggestion</b-button>
            <b-button variant="danger" class="mr-2" href="https://jira.cooperators.ca/servicedesk/customer/portal/18/create/399">Report a bug</b-button>
            <b-button variant="primary" class="mr-2" href="/api-docs">Api documentation</b-button>
         </b-jumbotron>
      </div>
      <div class="menu">
         <b-nav class="mt-4" tabs>
            <b-nav-item to="/home/how-to" :active="watchActive == '/home/how-to'">How to</b-nav-item>
            <b-nav-item to="/home/read-me" :active="watchActive.includes('/home/read-me')">Read me</b-nav-item>
            <b-nav-item to="/home/settings" :active="watchActive == '/home/settings'">Settings</b-nav-item>
         </b-nav>
      </div>
   </div>
</template>

<script>

export default {

   computed: {
      watchActive(){
         return this.$route.fullPath
      },
   }
};

</script>

<style>

   .jumbotron.hi{
      background-color: white;
      padding-bottom: 10px;
      padding-top: 40px;
   }

   .car{
      margin: auto;
   }

</style>
