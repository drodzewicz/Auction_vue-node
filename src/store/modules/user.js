import router from "@/router";
import vueInstance from "@/main";

const state = {
    user: null
};

const getters = {
    getUser: (state) => state.user
};

const actions = {
    LOGOUT: ({ commit }) => {
        vueInstance.$http.get("/api/auth/logout")
            .then(() => {
                vueInstance.$sock.close();
                commit("UPDATE_USER", null);
                router.push("/").catch(() => { });
            });
    }
};

const mutations = {
    UPDATE_USER (state, username) {
        state.user = username;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
