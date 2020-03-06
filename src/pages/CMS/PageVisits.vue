<template>
  <div class="md-layout">
      <div v-if='pages' v-for='(page, i) in pages' class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card v-if='!page.game' :header-color="colors[i]">
          <template slot="header">
            <div class="card-icon">
              <!-- <img class='white_icon' :src="require('../../.././public/img/'+page.slug+'.svg')"> -->
            </div>
            <p class="category">{{page.name}}</p>
            <h3 class="title">
              <animated-number v-if='page.clicks' :value="page.clicks"></animated-number>
              <animated-number v-else value="0"></animated-number>
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>update</md-icon>
              Just Updated
            </div>
          </template>
        </stats-card>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseInit";
import firebase from "firebase";
const increment = firebase.firestore.FieldValue.increment(1);

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
    AnimatedNumber
  },
  computed: {

  },
  data() {
    return {
      colors: ['blue','rose','warning','green','blue','rose','warning','green','blue','rose','warning','green'],
      pages: [],
      kiosks: []
    };
  },
  firestore() {
    return {
      pages: db.collection("page_totals"),
      kiosks: db.collection("kiosks")
    };
  },
  created() {
  },
  mounted() {
    console.log(this.pages);
  },
  methods: {
    getClicks(){
      let vm = this;
      let clicks = {};
      this.pages.forEach(function(page){
        if (!clicks[page.name]) {
          clicks[page.name] = page.clicks;
        }else {
          clicks[page.name] += page.clicks
        }
      });
      this.clicks = clicks
    },
    getKioskPages() {

    }
  },
  watch: {
    pages(){
      this.getClicks();
    }
  }
};
</script>

<style lang="css" scoped>

</style>
