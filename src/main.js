import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import io from "socket.io-client";
import store from "./store";

Vue.config.productionTip = false;

const SERVER_PORT = process.env.VUE_APP_API_URL || 8080;
const API_URL = process.env.NODE_ENV === "production" ? "/" : `http://localhost:${SERVER_PORT}/`;

const base = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

const socket = io(API_URL, { autoConnect: false });

Vue.prototype.$http = base;
Vue.prototype.$sock = socket;

export const bus = new Vue();

export default new Vue({
    store,
    router,
    render: h => h(App)
}).$mount("#app");
