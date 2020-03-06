// =========================================================
// * Vue Material Dashboard PRO - v1.3.1
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from "vue";
import VueRouter from "vue-router";
import DashboardPlugin from "./material-dashboard";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";
import firebase from "firebase";
import { firestorePlugin } from "vuefire";

// router setup
import router from "@/router";

// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(firestorePlugin);
Vue.config.productionTip = false;

// user authentification
// router.beforeEach((to, from, next) => {
//   const currentUser = firebase.auth().currentUser;
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

//   if (requiresAuth && !currentUser) next('login');
//   else if (!requiresAuth && currentUser) next('home')
//   else next();
// });

// global library setup
Object.defineProperty(Vue.prototype, "$Chartist", {
  get() {
    return this.$root.Chartist;
  }
});

let app = '';
/* eslint-disable no-new */
firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
		  el: "#app",
		  router,
		  data: {
		    Chartist: Chartist
		  },
		  render: h => h(App)
		}).$mount('#app')
	}
});


