<template>
  <nav id="main-nav">
    <router-link id="app-logo" to="/">
    <img src="../assets/logo.svg" />
    </router-link>
    <div v-if="getUser==null" class="authenticated-false nav-menu">
    <router-link class="nav-item" to="/login">Login</router-link>
    </div>
    <div v-else class="authenticated-true nav-menu">
        <router-link class="nav-item chat-button" :class="{notification: true}" to="/chat">
                <img src="../assets/message-icon.svg" />
        </router-link>
        <profile-dropdown>
            <button slot="profile-btn" class="nav-item profile-btn">
                <VImage imageUrl="" defaultImage="/default_avatar_image.svg"  />
                <span class="username">{{getUser}}</span>
            </button>
        </profile-dropdown>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import VImage from "@/components/VImage";
import ProfileDropdown from "@/components/ProfileDropdown";

export default {
    name: "Navbar",
    components: {
        VImage,
        ProfileDropdown
    },
    computed: mapGetters(["getUser"])
};
</script>

<style lang="scss" >
#main-nav {
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.3);
  background: $main-dark-blue;
  color: white;
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0.1rem 1rem;

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

.nav-menu {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
     & > * {
         margin: 0 0.3rem;
     }
     .chat-button {
         &.notification {
             &::after {
                 content: "";
                 position: absolute;
                 $dot-size: 0.7rem;
                 width: $dot-size;
                 height: $dot-size;
                 background:#E82F2F;
                 border-radius: 5rem;
                 transform: translate(110%, -80%);
             }
         }
     }
}

.nav-item {
    text-decoration: none;
    color: $main-dark-blue;
    background: #192771;
    color: white;
    border-radius: 5px;
    padding: 0rem 0.6rem;
    border: none;
    display: flex;
    place-items: center;
    font-size: 1rem;
    cursor: pointer;
    height: 2.2rem;
    outline: none;

    span {
        color: white;
        font-family: 'Secular One', sans-serif;
        margin-left: 0.3rem;
    }

    &.profile-btn {
        img {
            $avatar-size: 1.4rem;
            height: $avatar-size;
            width: $avatar-size;
            border-radius: 5rem;
        }
    }
}
}
</style>
