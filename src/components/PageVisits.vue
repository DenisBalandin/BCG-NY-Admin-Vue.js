<template>
  <div class="md-layout">
      <div class='filters'>

      </div>
      <div v-for='(page, i) in pages' class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card v-if='!page.game' :header-color="colors[i]">
          <template slot="header">
            <div class="card-icon">
              <img class='white_icon' :src="require('../.././public/img/'+page.slug+'.svg')">
            </div>
            <p class="category">{{page.name}}</p>
            <h3 class="title">
              <template v-if='kioskData[page.slug]'>
                <animated-number v-if='kioskData[page.slug].clicks > 0' :value="kioskData[page.slug].clicks"></animated-number>
                <animated-number v-else value="0"></animated-number>
              </template>
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
      colors: ['blue','rose','warning','green','blue','rose','warning','green'],
      pages: [],
      kioskData: []
    };
  },
  props: ['kioskId'],
  firestore() {
    return {
      pages: db.collectionGroup("pages"),
    };
  },
  methods: {
    getData(){
      let vm = this
      db.collectionGroup("kiosks")
      .where('kiosk_id', '==', this.kioskId)
      .get()
      .then(function(snapshot){
        vm.kioskData = snapshot.docs.reduce(function(obj, val, i) {
          obj[val.data().page] = val.data();
          return obj;
        }, {});
      })
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(function () {
      this.getData();
    })
    console.log(this.kioskId);
    console.log(this.pages);
  },
  watch: {
  }
};
</script>

<style lang="css" scoped>

</style>
