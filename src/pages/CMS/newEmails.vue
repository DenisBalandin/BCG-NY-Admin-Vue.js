<template>
  <div class="md-layout">
    <p @click='$router.go(-1)' class='back'>back</p>
    <h3 class='page_title'>{{$route.params.kiosk_id}}</h3>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="blue">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-eye"></i>
          </div>
          <p class="category">Page Visits</p>
          <h3 class="title">{{getRelativeVisits()}}</h3>
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
      <stats-card header-color="rose">
        <template slot="header">
          <div class="card-icon">
            <i class="far fa-laugh-wink"></i>
          </div>
          <p class="category">Referrals</p>
          <h3 class="title">
            <h3 class="title">{{allReferrals.length}}</h3>
          </h3>
        </template>

        <template slot="footer">
          <div @click='showResults("referrals")' class="stats clickable">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="warning">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-sd-card"></i>
          </div>
          <p class="category">Memory Game Emails</p>
          <h3 class="title">{{allMatchingEmails.length}}</h3>
        </template>

        <template slot="footer">
          <div @click='showResults("memory")' class="stats clickable">
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
          <p class="category">Page shares</p>
          <h3 class="title">{{allPageSends.length}}</h3>
        </template>

        <template slot="footer">
          <div @click='showResults("pageSends")' class="stats clickable">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card>
    </div>

    <transition name='fade'>
    <div v-if='results == "page-visit"' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <div class='md-card results_holder'>
        <h3>Page Visits</h3>
        <page-visits></page-visits>
      </div>
    </div>
    </transition>

    <transition name='fade'>
    <div v-if='results == "referrals"' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <div class='md-card results_holder'>
        <h3>Referrals</h3>
        <referrals></referrals>
      </div>
    </div>
    </transition>

    <transition name='fade'>
    <div v-if='results == "memory"' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <div class='md-card results_holder'>
        <h3>Memory Game Emails</h3>
        <emails emailName="matchingEmails"></emails>
      </div>
    </div>
    </transition>

    <transition name='fade'>
    <div v-if='results == "pageSends"' class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <div class='md-card results_holder'>
        <h3>Page Share Emails</h3>
        <emails emailName="pageSends"></emails>
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
      results: null,
      showPageVisits: false,
      pageVisits: 0,
      pageSends: 0,
      product1: "./img/card-2.jpg",
      product2: "./img/card-3.jpg",
      product3: "./img/card-1.jpg",
      allPageVisits: [],
      allMatchingEmails: [],
      allPageSends: [],
      allReferrals: []
    };
  },
  created(){
    this.getPageVisits();
    this.getReferrals();
    this.getMemoryEmails();
    this.getPageShares();
  },
  methods:{
    kioskPage(k){
      this.$router.push({ path: '/reports/'+k.slug });
    },
    getPageVisits(){
      let vm = this;
      db.collection('pagevisits').onSnapshot(snapshot => {
        snapshot.docs.forEach(function(page){
          vm.allPageVisits.push(page.data());
        });
      });
    },
    getRelativeVisits(){
      let vm = this;
      let total = 0;
      this.allPageVisits.forEach(function(pageVisit){
        if (pageVisit[vm.$route.params.kiosk_id]) {
          total += pageVisit[vm.$route.params.kiosk_id];
        }
      });
      if (total > 0) {
        return total;
      }else {
        return 0;
      }
    },
    getMemoryEmails(){
      let vm = this;
      db.collection('matchingEmails').where('kiosk', '==', this.$route.params.kiosk_id).onSnapshot(snapshot => {
        snapshot.docs.forEach(function(email){
          vm.allMatchingEmails.push(email.data());
        });
      });
    },
    getPageShares(){
      let vm = this;
      db.collection('pageSends').where('kiosk', '==', this.$route.params.kiosk_id).onSnapshot(snapshot => {
        snapshot.docs.forEach(function(pageSend){
          vm.allPageSends.push(pageSend.data());
        });
      });
    },
    getReferrals(){
      let vm = this;
      db.collection('referral').where('kiosk', '==', this.$route.params.kiosk_id).onSnapshot(snapshot => {
        snapshot.docs.forEach(function(referral){
          vm.allReferrals.push(referral.data());
        });
      });
    },
    showResults(name){
      this.results = name;
    }
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
