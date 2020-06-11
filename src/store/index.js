import Vuex from "vuex";
import Vue from "vue";
import user from "./modules/user";
import currency from "./modules/currency";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        currency
    }
});
