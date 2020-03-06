/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from "vue";
import VueAnalytics from "vue-analytics";
import Router from "vue-router";
import Meta from "vue-meta";
import firebase from "firebase";

// import { auth, functions, db } from "@/config/firebaseInit";

// Routes
import routes from "./routes";


// const verifyAdmin = functions.httpsCallable("verifyAdmin");

Vue.use(Router);

// Create a new router
const router = new Router({
  mode: "history",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record=>record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('login');
  }
  else {next()}
});

// router.beforeEach((to, from, next) => {
//   check if route requires auth
//     if (
//       to.matched.some(
//         rec => rec.meta && rec.meta.requiresAuth && rec.meta.section
//       )
//     ) {
//       // check auth state of user
//       return verifyAdmin()
//         .then(result => {
//           if (result.data) {
//             return checkPermissions(to, next);
//           } else {
//             router.push({ name: "Login", query: { redirect: to.name } });
//           }
//         })
//         .catch(error => {
//           console.log(error.message);
//           router.push({ name: "Login", query: { redirect: to.name } });
//         });
//     } else {
//       // has no auth req go on
//       next();
//     }
// });

// const checkPermissions = (rec, next) => {
//   let user = auth.currentUser;
//   return db
//     .collection("administrator")
//     .where("uid", "==", user.uid)
//     .get()
//     .then(query => {
//       if (query.docs.length) {
//         let permissions = query.docs[0].data().permissions;
//         if (true || permissions.includes(rec.meta.section)) {
//           return next();
//         } else {
//           return router.push({ name: "dashboard" });
//         }
//       } else {
//         return next();
//       }
//     });
// };

Vue.use(Meta);

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== "development"
    }
  });
}

export default router;
