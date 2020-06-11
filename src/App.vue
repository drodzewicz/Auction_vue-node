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
        async authenticateUser () {
            try {
                const response = await this.$http.get("api/auth/isAuthenticated");
                this.$store.commit("UPDATE_USER", response.data.user);
                this.$sock.open();
                this.$sock.emit("joinUserRoom", { userId: response.data.id });
                this.$sock.on("chatUserInfo", data => {
                    bus.$emit("changeMessage", `new message from ${data.newMessage}`, "");
                    bus.$emit("markUnreadMessage", data.roomId);
                });
            } catch (error) {
                this.$store.commit("UPDATE_USER", null);
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
