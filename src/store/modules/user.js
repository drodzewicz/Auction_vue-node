import router from "@/router";
import vueInstance from "@/main";

const state = {
    user: false,
    avatar: "",
    userId: null
};

const getters = {
    GET_USER: (state) => ({ username: state.user, avatar: state.avatar }),
    GET_USERID: (state) => state.userId
};

const actions = {
    LOGOUT: ({ commit }) => {
        vueInstance.$http.get("/api/auth/logout")
            .then(() => {
                vueInstance.$sock.close();
                commit("UPDATE_USER", null);
                commit("UPDATE_USERID", null);
                router.push("/").catch(() => { });
            });
    }
};

const mutations = {
    UPDATE_USER (state, username) {
        state.user = username;
    },
    UPDATE_AVATAR (state, avatarImage) {
        state.avatar = avatarImage;
    },
    UPDATE_USERID (state, userId) {
        state.userId = userId;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
