<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-content>
          <md-field>
            <label>First Name</label>
            <md-input v-model="user.firstname" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Last Name</label>
            <md-input v-model="user.lastname" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Email Address</label>
            <md-input v-model="user.email" type="email"></md-input>
          </md-field>
          <md-field>
            <label>Password</label>
            <md-input v-model="user.password" type="password"></md-input>
          </md-field>
          
          <!-- <md-field>
            <label>Location</label>
            <md-select v-model="location">
              <md-option
                v-for="location in locations"
                :key="location.id"
                :value="location.id"
                >{{ location.name }}</md-option
              >
            </md-select>
          </md-field> -->
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button class="md-primary md-round md-small" @click="signUp()"
            >Save</md-button
          >
        </md-card-actions>
      </md-card>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase';
import Fuse from "fuse.js";
import { db } from "@/config/firebaseInit";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        email: "",
        password: null,
      }
    };
  },
  watch: {
  },
  firestore() {
    return {
    };
  },
  methods: {
    signUp(){
      let vm = this;
      firebase.auth().createUserWithEmailAndPassword(this.user.email,this.user.password).then(function(msg){
        vm.$parent.flash = true;
            setTimeout(function(){
              return Swal.fire("Success", "User Created", "success");
            }, 500);
          },
          function(err) {
            alert(err.message);
          }
      );
    }
  },
  created() {
    

  },
  mounted() {
    // Fuse search initialization.
  }
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions{
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
