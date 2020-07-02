<template>
    <nav id="main-nav">
        <div class="nav-container">
            <router-link id="app-logo" to="/">
                <img src="../assets/logo.svg" alt />
            </router-link>
            <router-link
                v-if="getUser !== null"
                class="nav-item"
                to="/profile/my-auctions"
            ><i class="fas fa-user"></i>{{getUser}}</router-link>
            <div class="full-view">
                <router-link v-if="getUser !== null" class="nav-item" to="/chat">
                <i class="fas fa-comment-alt"></i>
                Chat
                </router-link>
                <router-link v-if="getUser == null" class="nav-item" to="/login">Login</router-link>
                <router-link v-if="getUser == null" class="nav-item" to="/register">Register</router-link>
                <a v-if="getUser !== null" class="nav-item" @click="logOutUser">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                  </a>
            </div>
            <div @click="toggleColapsedMenu" id="nav-hamburger"><i class="fas fa-bars"></i></div>
        </div>
        <div v-if="this.colapsed" class="colapsed-items">
            <router-link v-if="getUser !== null" class="nav-item" to="/chat">
              <i class="fas fa-comment-alt"></i>
              Chat
            </router-link>
            <router-link v-if="getUser == null" class="nav-item" to="/login">Login</router-link>
            <router-link v-if="getUser == null" class="nav-item" to="/register">Register</router-link>
            <a v-if="getUser !== null" class="nav-item" @click="logOutUser">
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </a>
        </div>
    </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "Navbar",
    data () {
        return {
            colapsed: false
        };
    },
    methods: {
        toggleColapsedMenu () {
            this.colapsed = !this.colapsed;
        },
        logOutUser () {
            this.$store.dispatch("LOGOUT");
        }
    },
    computed: mapGetters(["getUser"])
};
</script>

<style lang="scss" >
#main-nav {
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.3);
    background: $main-dark-blue;
    color: white;
    transition: all 0.3s ease-in-out;
    width: 100%;

    #app-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0;
        margin-right: auto;
        color: white;
        img {
            height: 3rem;
            width: 3rem;
        }
    }

    .nav-container {
        padding: 0.5rem 2rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        #nav-hamburger {
            cursor: pointer;
            display: none;
            font-size: 1.4rem;
            @include mobile {
                display: block;
            }
        }
        .full-view {
            display: flex;
            flex-direction: row;
            @include mobile {
                display: none;
            }
        }
    }
    @keyframes nav-items-apear {
        0% {
            height: 0rem;
            color: transparent;
            background: transparent;
        }
        50% {
            color: white;
            background: auto;
        }
        100% {
            height: 1.5rem;
        }
    }

    .colapsed-items {
        display: none;
        padding: 1rem 0;
        flex-direction: column;
        align-items: center;
        background: rgba(0, 0, 0, 0.245);

        @include mobile {
            display: flex;
        }
        .nav-item {
            border: none;
            margin: 0.4rem 0;
            animation: nav-items-apear 0.4s ease-out forwards;
            .fas {
              margin-right: 0.3rem;
            }
        }
    }
    .nav-item {
        margin: 0 0.5rem;
        text-decoration: none;
        color: white;
        transition: all 0.15s ease-in-out;
        border: 1.2px solid white;
        padding: 0.2rem 0.8rem;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background: rgba(255, 255, 255, 0.177);
        }
        &.router-link-exact-active {
            background: white;
            color: $main-dark-blue;
        }
        .fas {
            margin-right: 0.3rem;
          }
    }
}
</style>
