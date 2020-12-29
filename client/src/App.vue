<template>
   <div id="app">
      <vue-progress-bar></vue-progress-bar>
      <app-header></app-header>
      <div class="my-container">
         <router-view></router-view>
      </div>
   </div>
</template>

<script>

import { bus } from './main';
import Header from './components/shared/Header'

export default {

   name: 'app',
   components: {
      'app-header': Header
   }
   
}
</script>

<style>

   .inline-block{
      display: inline-block;
   }

   .display{
      margin-bottom: 20px;
      padding: 10px 10px 10px 10px;
      border: 2px solid rgb(218, 215, 215);
      border-radius: 10px;
   }

   .questionHeader{
      margin-bottom: 1px;
      cursor: pointer;
   }

   .bg-bg{
      background-color: #acff99;
      color: black;
      font-weight: 600;
   }

   .txt-bg{
      color: #acff99;
   }

   .questionHeader:focus{
      outline: none;
   }

   html, body, #app, .container{
      height: 100%;
   }

   #BranchComparison .table-bordered th, .table-bordered td{
      font-size: 13px;
   }

   .notSame{
      background-color: rgb(255, 155, 155);
   }

   .same{
      background-color: rgb(170, 255, 170);
      border: 2px solid black;
   }

   .form-inline{
      float: left;
      margin-right: 20px;
   }

   li a{
      color: black;
   }

   .content{
      padding-top: 20px;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
   }

   table > tbody > tr > td:nth-child(1){
      font-weight: bold;
   }

   table > tbody > tr > td{
      width: 70px;
      word-break: break-all;
   }

   div.VueTables__columns-dropdown-wrapper.pull-right.dropdown > div{
      float: left;
      margin-top: 23px;
   }

   div.VueTables__columns-dropdown-wrapper.pull-right.dropdown > div > ul li span input{
      margin-right: 8px;
      margin-left:5px;
   }

   .my-container{
      max-width: 1600px;
      margin: auto;
      padding: 20px 20px 20px 20px;
      margin-bottom: 800px;
   }

   #header > nav > ul > li:nth-child(1) > a > div > a:hover{
      color: white;
   }

   div.VuePagination.row.col-md-12{
      justify-content: center;
      margin-right: 0;
   }

   .table-bordered th, .table-bordered td{
      border: 1px solid rgb(100, 100, 100);
   }

   .disp{
      background-color: rgb(243, 241, 241);
      border-radius: 10px;
      padding: 20px 20px 20px 20px;
      -webkit-box-shadow: 5px 5px 6px 1px rgba(224,224,224,1);
      -moz-box-shadow: 5px 5px 6px 1px rgba(224,224,224,1);
      box-shadow: 5px 5px 4px 1px rgba(224,224,224,1);
   }

   .fix{
      height: 320px;
   }

   .filterOpt.env{
      height: 31px;
      padding-top: 2px;
      margin-right: 4px;
   }

   body{
      padding-right: 0px !important;
   }
   
   #Search .custom-control-input{
      cursor: pointer;
   }

   #__BVID__241 > div > label{
      cursor: pointer;
   }

   .filterOpt{
      display: inline-block;
      margin-right: 8px;
      margin-top: 5px;
      padding-left: 5px;
      border-radius: 10px;
      padding-top: 5px;
   }

   .custom-control, .customer-switch{
      display: inline-block !important;
      margin-left: 5px;
   }

   .dark{
      background-color: rgb(108, 117, 125);
      color: rgb(255, 255, 255);
      font-weight:400;
   }

   

</style>
