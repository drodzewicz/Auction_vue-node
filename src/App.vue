<template>
    <div id="app">
        <pop-down />
        <navbar />
        <div class="content-container">
            <router-view />
        </div>
    </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import PopDown from "./components/PopDown.vue";
import { bus } from "./main";
import { mapGetters } from "vuex";
export default {
    name: "App",
    components: {
        Navbar,
        PopDown
    },
    created () {
        this.authenticateUser();
    },
    methods: {
        ...mapGetters(["getUser", "GET_USERID"]),
        listenForNotification (data) {
            bus.$emit("changeMessage", `new message from ${data.newMessage}`, "", `/chat/${data.roomId}`);
            bus.$emit("markUnreadMessage", data.roomId);
        },
        listenForBidNotification (data) {
            bus.$emit("changeMessage", `you have been outbiddet on ${data.auctionName}`, "", `/auction/${data.roomId}`);
        },
        async authenticateUser () {
            this.$store.watch(() => this.getUser(), () => {
                if (this.getUser()) {
                    this.$sock.emit("joinUserRoom", { userId: this.GET_USERID() });
                    this.$sock.on("chatUserInfo", this.listenForNotification);
                    this.$sock.on("chatUserBidInfo", this.listenForBidNotification);
                } else if (this.getUser() == null) {
                    this.$sock.removeListener("chatUserInfo", this.listenForNotification);
                    this.$sock.removeListener("chatUserBidInfo", this.listenForBidNotification);
                }
            });
            try {
                const response = await this.$http.get("api/auth/isAuthenticated");
                this.$sock.open();
                this.$store.commit("UPDATE_USER", response.data.user);
                this.$store.commit("UPDATE_USERID", response.data.id);
            } catch (error) {
                this.$store.commit("UPDATE_USER", null);
                this.$store.commit("UPDATE_USERID", null);
            }
        }
    }
};
</script>

<style lang="scss">
body {
    background: $main-light-grey;
    padding: 0;
    margin: 0;
    font-family: "Secular One", sans-serif;
}
#app {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}
.content-container {
    margin: 0.4rem 2rem;
    transition: all 0.3s ease-in-out;
    @include mobile {
        margin: 0.4rem 0.8rem;
    }
}
</style>
