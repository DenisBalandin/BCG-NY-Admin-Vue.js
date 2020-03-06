<template>
  <div class="md-layout">
    <div class="md-layout-item">
    <p @click='$router.go(-1)' class='back'>back</p>
      <md-card>
        <md-card-content>
          <md-field>
            <label>First Name</label>
            <p class="order-info">{{ scan.firstName }}</p>
          </md-field>
          <md-field>
            <label>Last Name</label>
            <p class="order-info">{{ scan.lastName }}</p>
          </md-field>
          <md-field>
            <label>Email</label>
            <p class="order-info">{{ scan.email }}</p>
          </md-field>
          <md-field>
            <label>Phone</label>
            <p class="order-info">{{ scan.phone }}</p>
          </md-field>
          <md-field>
            <label>Location</label>
            <p class="order-info">{{ scan.location }}</p>
          </md-field>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      name: 'Scan Details',
      scan: null
    }
  },
  firestore() {
    return {};
  },
  methods: {
    getOrder() {
      let vm = this;
      db.collection("scheduled_appointments").doc(vm.$route.params.scan_id)
      .get()
      .then(function(snapshot) {
        // console.log(snapshot.data());
        vm.scan = snapshot.data()
      })
    }
  },
  created() {
    this.getOrder()
  },
  mounted() {
    console.log(this.order);
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
