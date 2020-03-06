<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
      <stats-card header-color="blue">
        <template slot="header">
          <div class="card-icon">
            <i class="fas fa-building"></i>
          </div>
          <p class="category">Private Dining</p>
          <h3 class="title">
            <animated-number v-if='buildings.length > 0' :value="buildings.length"></animated-number>
          </h3>
        </template>

        <template slot="footer">
          <div @click='goTo("privatedining")' class="stats">
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
            <i class="fas fa-user-friends"></i>
          </div>
          <p class="category">Catering</p>
          <h3 class="title">
            <animated-number v-if='companies.length > 0' :value="companies.length"></animated-number>
          </h3>
        </template>

        <template slot="footer">
          <div @click='goTo("catering")' class="stats">
            <p>View Details</p>
            <md-icon>navigate_next</md-icon>
          </div>
        </template>
      </stats-card>
    </div>

    <!-- <div v-for='k in kiosks' class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
      <p class='offline_banner' v-if='isOffline(k)'>OFFLINE</p>
      <div
      :class="{offline: isOffline(k)}"
      class="md-card kiosk_statcard">
        <p class='name'>{{k.name}} <span @click='kioskPage(k)'>details</span></p>
        <p class='details'>{{k.description}}</p>
        <div class='stats'>
          <div class='stat' :style="{backgroundColor: '#00acc1'}">
            <i class="fas fa-eye"></i>
            <animated-number v-if='k.clicks > 0' :value="k.clicks"></animated-number>
            <p v-else>0</p>
          </div>
          <div class='stat' :style="{backgroundColor: '#d81b60'}">
            <i class="far fa-laugh-wink"></i>
            <animated-number v-if='orders.length > 0' :value="getRelativeOrders(k)"></animated-number>
            <p v-else>0</p>
          </div>
          <div class='stat' :style="{backgroundColor: '#fb8c00'}">
            <i class="fas fa-sd-card"></i>
            <animated-number v-if='memoryStats[k.slug] > 0' :value="memoryStats[k.slug]"></animated-number>
            <p v-else>0</p>
          </div>
          <div class='stat' :style="{backgroundColor: '#1C479A'}">
            <i class="fas fa-share"></i>
            <animated-number v-if='pageSendStats[k.slug] > 0' :value="pageSendStats[k.slug]"></animated-number>
            <p v-else>0</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { db } from "@/config/firebaseInit";
import AsyncWorldMap from "@/components/WorldMap/AsyncWorldMap.vue";
var moment = require('moment');
var tz = require('moment-timezone');

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
    AsyncWorldMap
  },
  data() {
    return {
      buildings: null,
      companies: null,
      clicks: [],
      pageVisits: 0,
      wofEmails: 0,
      matchingEmails: 0,
      orders: [],
      scans: 0,
      product1: "./img/card-2.jpg",
      product2: "./img/card-3.jpg",
      product3: "./img/card-1.jpg",
      seq2: 0,
      mapData: {
        AU: 760,
        BR: 550,
        CA: 120,
        DE: 1300,
        FR: 540,
        GB: 690,
        GE: 200,
        IN: 200,
        RO: 600,
        RU: 300,
        US: 2920
      },
      dailySalesChart: {
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },

        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
        kiosks: [],
        allPageVisits: [],
        allMatchingEmails: [],
        allOrders: [],
        allReferrals: [],
        referralCount: 0,
        pageSendCount: 0,
        pageVisitCount: 0,
        referralStats: {},
        memoryStats: {},
        pageSendStats: {},
    };
  },
  firestore() {
    return {
      buildings: db.collection("building"),
      companies: db.collectionGroup("companies")
    };
  },
  created(){
    this.getReferrals();
    this.getMemoryEmails();
    this.getScans()
  },
  methods:{
    goTo(url){
      this.$router.push({path:'/'+url});
    },
    getClicksSum(clicks, num){
      return clicks + num.data().clicks;
    },
    kioskPage(k){
      this.$router.push({ path: '/reports/'+k.id });
    },
    getMemoryEmails(){
      let vm = this;
      db.collection('wofEmails')
      .get().then(function(snapshot){
        vm.matchingEmails = snapshot.docs.length;
        vm.addToKiosk(snapshot.docs, 'memoryStats');
      });
    },
    getRelativeOrders(k) {
      let vm = this;
      let count = 0;
      vm.orders.forEach(function(order){
        if (order.kiosk == k.id) {
          count ++;
        }
      });
      return count;
    },
    getScans() {
      let vm = this;
      db.collection('scheduled_appointments')
      .get().then(function(snapshot) {
        vm.scans = snapshot.docs.length
      })
    },
    addToKiosk(arr, objName){
      this[objName] = arr.reduce(function(acc, cur, i) {
        // console.log(acc)
        if (acc[cur.data()['kiosk']]) {
          acc[cur.data()['kiosk']] += 1;
        }else {
          acc[cur.data()['kiosk']] = 1;
        }
        return acc;
      }, {});
    },
    isOffline(k) {
      if (!k.lastSignal) {
        return true;
      }else {
        var now = moment.tz(Date.now(), "America/New_York")
        var then = moment.tz(k.lastSignal, "America/New_York")
        var duration = moment.duration(now.diff(then));
        var mins = duration.asMinutes();
        // console.log(k.name +': '+mins)
        if (mins > 20) {
          return true;
        }else {
          return false;
        }
      }
    },
    getPageShares(){
      let vm = this;
      db.collection('pageSends')
      .get().then(function(snapshot){
        vm.pageSends = snapshot.docs.length;
        vm.addToKiosk(snapshot.docs, 'pageSendStats');
      });
    },
    getReferrals(){
      let vm = this;
      db.collection('referral')
      .get().then(function(snapshot){
        vm.allReferrals = snapshot.docs;
        vm.addToKiosk(vm.allReferrals, 'referralStats');
      });
    },
  }
};
</script>

<style type="text/css">
  .offline {
    opacity: .3;
  }

  .offline_banner {
    position: absolute;
    top: 0;
    width: 23%;
    min-width: 150px;
    font-weight: bold;
    margin: 0;
    color: white;
    padding: 5px 10px;
    background: #333333;
    z-index: 2;
    box-sizing: border-box;
  }
</style>
