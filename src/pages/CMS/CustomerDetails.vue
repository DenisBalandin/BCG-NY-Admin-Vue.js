<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
    <p @click='$router.go(-1)' class='back'>back</p>
      <md-card>
        <md-card-content v-if="customer">
          <md-field>
            <label>First Name</label>
            <p class="order-info">{{ customer.firstName }}</p>
          </md-field>
          <md-field>
            <label>Last Name</label>
            <p class="order-info">{{ customer.lastName }}</p>
          </md-field>
          <md-field>
            <label>Email</label>
            <p class="order-info">{{ customer.email }}</p>
          </md-field>
          <md-field>
            <label>Phone</label>
            <p class="order-info">{{ customer.phone }}</p>
          </md-field>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <h3>Orders</h3>
    </div>
    <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33" v-if="orders.length > 1" v-for="order in orders" :key="order.id">
      <md-card>
        <md-card-content>
          <md-field>
            <label>Date</label>
            <p class="order-info">{{ getTime(order.created) }}</p>
          </md-field>
          <md-field>
            <label>Kiosk</label>
            <p class="order-info">{{ getKioskName(order.kiosk) }}</p>
          </md-field>
          <md-field>
            <label>Products</label>
            <div>
              <p class="order-info" v-for="product in order.products">{{ product.name }}</p>
            </div>
          </md-field>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
var moment = require('moment');
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";
import { StatsCard, AnimatedNumber } from "@/components";

export default {
  components: { StatsCard, AnimatedNumber },
  data() {
    return {
      name: 'Customer Details',
      customer: null,
      orders: []
    }
  },
  firestore() {
    return {};
  },
  methods: {
    getCustomer() {
      let vm = this;
      db.collection("customers").doc(vm.$route.params.customer_id)
      .get()
      .then(function(snapshot) {
        vm.customer = snapshot.data()
      })
      .then(() => {
        vm.getOrders()
      })
    },
    getOrders() {
      let vm = this;
      db.collection("customers").doc(vm.$route.params.customer_id)
      .collection("orders")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.docs.forEach(function(order) {
          let orderData = order.data()
          orderData.id = order.id;
          vm.orders.push(orderData)
        })
      })
    },
    getKioskName(id) {
      let vm = this;
      db.collection("kiosks").doc(id).get()
      .then((snapshot) => {
        let kioskName = snapshot.data().name;
        console.log(kioskName);
      })
    },
    getTime(time) {
      return moment(time).format('LLL');
    }
  },
  created() {
  },
  mounted() {
    this.getCustomer()
  },
  updated() {
    console.log(this.customer);
    console.log(this.orders);
  }
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions{
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}

.order-info {
  margin-top: 2.5em
}
</style>
