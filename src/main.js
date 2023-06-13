import Vue from "vue"
import App from "@/App"
import store from "@/store"
import router from "@/router"
import "@/plugins/auth"
import vuetify from "@/plugins/vuetify"

import app from "@/middleware/firebase"

import { getAuth, onAuthStateChanged } from "firebase/auth"

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};


Vue.use(Toast, options);
Vue.config.productionTip = false

// reload VUE app on Firebase auth state change
onAuthStateChanged(getAuth(app), () => {
  new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app")
})
