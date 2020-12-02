<template>
    <div class="profile-container">

        <nav class="profile-nav" :class="{hide: !showSubNavBar}">
            <div class="nav-header">
                <span class="arrows" @click="toggleSubNav">
                    <img src="@/assets/double-arrow.svg" alt="double arrow" srcset="">
                </span>
            </div>
            <ul class="profile-navigation-tab">
                <router-link class="profile-nav-item" to="/profile/my-auctions">My Auctions</router-link>
                <router-link class="profile-nav-item" to="/profile/live-auctions"
                >Live Auction Pannel</router-link>
                <router-link class="profile-nav-item" to="/profile/participated">Participations</router-link>
                <router-link class="profile-nav-item" to="/profile/purchased">Purchased</router-link>
            </ul>
        </nav>
        <div class="profile-content">
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
    .profile-container {
        display: flex;
        flex-direction: row;
        min-height: inherit;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        .profile-nav {
            z-index: 3;
            width: 15rem;
            background: #e0e1e4;
            transition: all 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            @include mobile {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
            }
        .nav-header {
            transition: all 0.3s ease-in-out;
            background: #D0D5EF;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 1rem;
            height: 3rem;
            .arrows {
                background: #A7AED1;
                width: 3rem;
                height: 3rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                img {
                    transform: rotate(180deg);
                    transition: transform 0.3s ease-in-out;
                }
            }
        }
        &.hide {
            margin-left: -15rem;
            @include mobile {
                width: 15rem;
                // height: 100%;
                // left: 0;
            }
            .arrows img {
                transform: rotate(0)
            }
            .nav-header {
                transform: translateX(3rem);
                border-bottom-left-radius: 10px;
                overflow: hidden;
                border-bottom-right-radius: 10px;
             }
        }
        .profile-navigation-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
            padding: 0;
           .profile-nav-item{
               text-decoration: none;
               color: $main-dark-blue;
               font-size: 1.2rem;
               margin-bottom: 2rem;
                padding: 0.6rem 1.1rem;
                 border-radius: 10px;
               &.router-link-active {
                   background: $main-dark-blue;
                   color: $main-yellow;
               }
           }
        }
    }
        .profile-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            margin: 1rem;
            display: flex;
            position: relative;
            .section-title {
                color: $main-dark-blue;
                background: #dee3f7;
                padding: 0.4rem 1.2rem;
                border-radius: 5px;
                font-size: 1.2rem;
            }
        }

    }
</style>
