<template>
  <div class="md-layout">
    <h3 class='page_title'>{{$route.params.kiosk_id}}</h3>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <!-- <stats-card header-color="warning">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-sd-card"></i>
          </div>
          <p class="category">Memory Emails</p>
          <h3 class="title">{{allMatchingEmails.length}}</h3>
        </template>

        <template slot="footer">
          <div @click='showResults("page-visit")' class="stats clickable">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="green">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-share"></i>
          </div>
          <p class="category">Page Shares</p>
          <h3 class="title">
            <h3 class="title">{{allPageSends.length}}</h3>
          </h3>
        </template>

        <template slot="footer">
          <div @click='showResults("pageSends")' class="stats clickable">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card> -->
    </div>
    <!-- Email Filtering By Date -->
    <transition name='fade'>
    <div v-if='true' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">

      <div class='md-card results_holder'>
        <h3>Filter Emails</h3>
        <!-- From Date -->
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-datepicker v-model="fromDate">
            <label>From</label>
          </md-datepicker>
        </div>
        <!-- To Date -->
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-datepicker v-model="toDate">
            <label>To</label>
          </md-datepicker>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-100">
          <button type="button" @click="setDateRange" class="md-button md-theme-default">
            <div class="md-ripple">
              <div class="md-button-content">
                <i class="md-icon md-icon-font material-icons md-theme-default">filter_list</i>
              </div>
            </div>
          </button>
          <button type="button" @click="resetDates" class="md-button md-theme-default">
            <div class="md-ripple">
              <div class="md-button-content">
                Reset
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    </transition>

    <transition name='fade'>
    <div v-if='true' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <div class='md-card results_holder'>
        <h3>{{emailName}}</h3>
        <emails :emailName="emailType" :all='allEmails' :fromDate="fromDate" :toDate="toDate"></emails>
      </div>
    </div>
    </transition>

  </div>
</template>

<script>
import { db } from "@/config/firebaseInit";
import AsyncWorldMap from "@/components/WorldMap/AsyncWorldMap.vue";
import PageVisits from "@/components/PageVisits.vue";
import Referrals from "@/components/Referrals.vue";
import Emails from "@/components/Emails.vue";


import {
  StatsCard,
  ChartCard,
  ProductCard,
  AnimatedNumber,
  GlobalSalesCard,
  GlobalSalesTable
} from "@/components";

export default {
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber,
    ProductCard,
    GlobalSalesCard,
    GlobalSalesTable,
    AsyncWorldMap,
    'page-visits': PageVisits,
    'referrals': Referrals,
    'emails': Emails
  },
  data() {
    return {
      allEmails: true,
      emailName: 'All Emails',
      emailType: null,
      results: 'memory',
      showPageVisits: false,
      pageVisits: 0,
      pageSends: 0,
      product1: "./img/card-2.jpg",
      product2: "./img/card-3.jpg",
      product3: "./img/card-1.jpg",
      allPageVisits: [],
      allMatchingEmails: [],
      allPageSends: [],
      allReferrals: [],
      names: {
        'matchingEmails': 'Matching Emails',
        'pageSends': 'Page Sends',
        'all': 'All Emails'
      },
      fromDate: '',
      toDate: ''
    };
  },
  created(){
    this.setEmails()
  },
  mounted(){

  },
  methods:{
    setEmails(){
      if (this.$route.params.id){
        this.emailType = this.$route.params.id;
        this.emailName = this.names[this.$route.params.id];
      }else {
        this.emailType = 'all';
        this.emailName = 'All Emails'
      }
    },
    showResults(name){
      this.results = name;
    },
    setDateRange() {
      this.allEmails = false
    },
    resetDates() {
      this.allEmails = true
      this.fromDate = null
      this.toDate = null
    }
  },
  beforeRouteUpdate(to, from, next){
    next()
    this.emailType = null;
    this.setEmails();
    // this.getMemoryEmails();
    // this.getPageShares();
    // next()
  }
};
</script>

<style>

  .results_holder {
    padding: 20px;
    margin-top: 0;
    /*border-bottom: 10px solid #0bb1c6;*/
  }

  .results_holder .table .md-card {
    margin-top: 0;
  }

  .results_holder > h3 {
    font-weight: bold;
  }

</style>
