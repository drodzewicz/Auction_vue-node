<template>
    <div class="profile-container">
        <nav class="profile-nav" :class="{hide: !showSubNavBar}">
            <ul class="profile-navigation-tab">
                <button class="menu-button" @click="toggleSubNav"><i class="fas fa-times"></i></button>
                <router-link class="profile-nav-item" to="/profile/my-auctions">My Auctions</router-link>
                <router-link
                    class="profile-nav-item"
                    to="/profile/live-auctions"
                >Live Auction Pannel</router-link>
                <router-link class="profile-nav-item" to="/profile/participated">Participations</router-link>
                <router-link class="profile-nav-item" to="/profile/purchased">Purchased</router-link>
            </ul>
        </nav>
        <div class="profile-content">
            <button class="menu-button" @click="toggleSubNav"><i class="fas fa-bars"></i></button>
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: "Profile",
    data () {
        return {
            showSubNavBar: true
        };
    },
    methods: {
        toggleSubNav () {
            this.showSubNavBar = !this.showSubNavBar;
        }
    }
};
</script>

<style lang="scss">
$profile-nav-width: 15rem;
.profile-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    .profile-nav {
        background: lightgray;
        position: absolute;
        left: 0;
        top: 4.5rem;
        height: 100%;
        width: $profile-nav-width;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-shadow: 1px 0 3px 2px rgba(0, 0, 0, 0.211);
        overflow: hidden;
        z-index: 3;
        transition: 0.3s all ease-in-out;

        @include breaking-point-sm {
            width: 100%;
        }

        &.hide {
           width: $profile-nav-width;
            @include breaking-point-sm {
                 width: 0;
            }
        }

        .profile-navigation-tab {
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            .profile-nav-item {
                list-style: none;
                margin: 1rem 0;
                cursor: pointer;
                color: $main-dark-blue;
                border-radius: 10px;
                text-decoration: none;
                padding: 0.4rem 0.6rem;

                &.router-link-exact-active {
                    background: white;
                    color: $main-dark-blue;
                }
            }
        }
    }
    .profile-content {
        width: 100%;
        margin-left: $profile-nav-width;
        transition: all 0.3s ease-in-out;
        @include breaking-point-sm {
            margin-left: 0;
        }
    }

     .menu-button {
        margin-top: 1rem;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
          display: none;
            @include breaking-point-sm {
                display: block;
            }
        }
}
</style>
