<template>
   <div class="content">
      <div id="overview">
         <tree-view :data="$store.state.jsonObject" :options=" { maxDepth: 1, rootObjectKey: $store.state.application + ' - ' + $store.state.branchSelection, limitRenderDepth: true } "></tree-view>
      </div>
   </div>
</template>

<script>

export default {
   // Going to possibly add more to this overview file but for now it just represnts the jsonTree
}
</script>

<style>

   .tree-view-item-key{
      color: rgb(58, 58, 58);
   }

   .tree-view-item-node, .tree-view.item-leaf{
      font-size: 17px;
   }

</style>