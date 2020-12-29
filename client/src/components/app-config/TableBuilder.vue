<template>
  <div id="TableBuilder">
     <div class="filter">
        <table-filter></table-filter>
     </div>
  </div>
</template>

<script>

// This is a wrapper component for table builder

import TableFilter from './TableFilter';

export default {

   name: 'table-builder', 
   components: {
      'table-filter': TableFilter
   }
}
</script>

<style scoped>

   .filter{
      padding: 20px 20px 20px 20px;
   }

</style>