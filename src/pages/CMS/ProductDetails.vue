<template>
  <div class="md-layout">
    <div class="md-layout-item">
    <p @click='$router.go(-1)' class='back'>back</p>
      <md-card>
        <md-card-content>
          <md-field>
            <label>Product Name</label>
            <p class="order-info">{{ product.name }}</p>
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
      name: 'Product Details',
      order: null
    }
  },
  firestore() {
    return {};
  },
  methods: {
    getOrder() {
      let vm = this;
      db.collection("products").doc(vm.$route.params.product_id)
      .get()
      .then(function(snapshot) {
        // console.log(snapshot.data());
        vm.product = snapshot.data()
      })
    }
  },
  created() {
    this.getProduct()
  },
  mounted() {
    console.log(this.product);
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
