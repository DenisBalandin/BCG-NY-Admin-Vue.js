<template>
  <div class="md-layout">
    <p @click="$router.go(-1)" class="back">back</p>
    <h3 class="page_title">{{this.buildingName}}</h3>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="blue">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-eye"></i>
          </div>
          <p class="category">Page Visits</p>
          <h3 class="title">{{this.buildingClicks}}</h3>
        </template>

        <template slot="footer">
          <div @click="showResults('page-visit')" class="stats clickable">
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
          <p class="category">Searched</p>
          <h3 class="title">{{pageSearched}}</h3>
        </template>

        <template slot="footer">
          <div @click="showResults('scans')" class="stats clickable">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card>
    </div>

    <transition name="fade">
      <div
        v-if="results == 'page-visit'"
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="md-card results_holder">
          <h3>Page Visits</h3>
          <page-visits :buildingId="$route.params.kiosk_id"></page-visits>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="results == 'orders'"
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="md-card results_holder">
          <h3>Orders</h3>
          <referrals :referrals="allOrders"></referrals>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="results == 'memory'"
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="md-card results_holder">
          <h3>Memory Game Emails</h3>
          <emails emailName="matchingEmails" :allEmails="allMatchingEmails" :all="false"></emails>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="results == 'scans'"
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="md-card results_holder">
          <h3>Scan Appointments</h3>
          <scans :scans="allScans" :all="false"></scans>
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
import Scans from "@/components/Scans.vue";

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
    "page-visits": PageVisits,
    referrals: Referrals,
    emails: Emails,
    scans: Scans
  },
  data() {
    return {
      buildingName: "",
      buildingClicks: 0,
      buildingId: "",
      kioskOrders: 0,
      kioskScans: 0,
      kioskEmails: 0,
      actualVisits: 0,
      results: null,
      showPageVisits: false,
      pageVisits: 0,
      pageSearched: 0,
      product1: "./img/card-2.jpg",
      product2: "./img/card-3.jpg",
      product3: "./img/card-1.jpg",
      allScans: [],
      allPageVisits: [],
      allMatchingEmails: [],
      allOrders: [],
      allPageSends: [],
      allReferrals: [],
      buildingSlug: null
    };
  },
  created() {
    this.getKioskData();
    this.buildingId = this.$route.params.building_id;
  },
  methods: {
    kioskPage(k) {
      this.$router.push({ path: "/reports/" + k.slug });
    },
    getKioskData() {
      let vm = this;
      let buildingName;
      let clicks;
      this.$bind(
        "building",
        db.collection("building").doc(this.$route.params.building_id)
      ).then(snapshot => {
        this.buildingName = snapshot.name;
        this.buildingSlug = snapshot.slug;
        this.buildingName = buildingName;
        // vm.buildingClicks += clicks;
      });
    },
    getRelativeVisits() {
      let vm = this;
      let total = 0;
      this.allPageVisits.forEach(function(pageVisit) {
        if (pageVisit[vm.$route.params.kiosk_id]) {
          total += pageVisit[vm.$route.params.kiosk_id];
        }
      });
      if (total > 0) {
        return total;
      } else {
        return 0;
      }
    },

    showResults(name) {
      this.results = name;
    }
  }
};
</script>

<style scoped>
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

.md-card.md-theme-default {
    margin-top: 10px;
    background: #ffffff !important;
}
</style>
