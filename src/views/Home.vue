<template>
    <div class="home-container">
        <div class="landing-page-cover">
            <div class="welcome-container">
                <h1 class="welcome">Welcome to Bidder!</h1>
                <h3 class="welcome-text">Here you will find what you are looking for.</h3>
                <h3 class="welcome-text">Auction, buy and win !</h3>
            </div>
            <img id="love-icon" src="@/assets/love.svg" alt="love">
            <img id="bags" src="@/assets/bags.svg" alt="bags">
        </div>
        <section class="offers">
            <img class="wave-bg" src="@/assets/wave_bg.svg" alt="wave">
            <div class="offer-wrapper">
                <spinner-1 v-if="spinner" />
                <product-container v-if="!spinner" :auctions=auctions />
                <router-link v-if="!spinner" to="/auction" class="more">
                    <span>More</span>
                    <img src="@/assets/more.svg" alt="more">
                </router-link>
            </div>
        </section>
    </div>
</template>

<script>
import { Spinner1 } from "@/components/Spinners";
import ProductContainer from "@/components/ProductContainer";

export default {
    name: "Home",
    components: {
        ProductContainer,
        Spinner1
    },
    data () {
        return {
            auctions: [],
            spinner: true
        };
    },
    created () {
        this.fetchAuctions();
    },
    methods: {
        async fetchAuctions () {
            this.spinner = true;
            try {
                const reposne = await this.$http.get("/api/auction?page=1&limit=8&finished=false");
                const { items } = reposne.data.auctions;
                this.auctions = items;
                this.spinner = false;
            } catch (error) {
                this.spinner = false;
            }
        }
    }
};
</script>

<style lang="scss">
.home-container {
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .landing-page-cover {
        height: 90vh;
        max-width: 50rem;
        min-height: 38rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        #love-icon {
            height: 5rem;
            margin-top: 1rem;
            opacity: 0;
            animation: element-apear 1s ease-out forwards 2s;
            @include mobile {
                 display: none;
            }
        }
        #bags {
            height: 25rem;
            width: 100%;
            opacity: 0;
            animation: element-apear 1s ease-out forwards 2s;
            @include breaking-point-sm {
                height: 20rem;
            }
            @include mobile {
                height: 10rem;
            }
        }
        .welcome-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex-grow: 1;
            margin-bottom: 4rem;
            @include mobile {
                margin: 0 0.5rem;
                align-items: center;
                margin-top: 4rem;
            }
            .welcome {
                margin: 0;
                font-size: 3rem;
                animation: element-slide-left 1s ease-out forwards 0.5s;
                opacity: 0;
                @include breaking-point-sm {
                 font-size: 2.5rem;
                 text-align: center;
                }
            }
            .welcome-text {
                margin: 0;
                opacity: 0;
                font-size: 1.5rem;
                color: rgb(86, 86, 100);
                &:nth-child(2) {
                    animation: element-slide-left 1s ease-out forwards 1s;
                }
                &:nth-child(3) {
                    animation: element-slide-left 1s ease-out forwards 1.6s;
                }
                @include breaking-point-sm {
                 font-size: 1rem;
                }
            }
        }
    }

    .offers {
        width: 100%;
        overflow-y: hidden;
        .wave-bg {
            width: 100%;
            position: absolute;
        }
        .offer-wrapper {
            position: relative;
            z-index: 2;
            background: $main-dark-blue;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 15%;
            padding-bottom: 2rem;
            min-height: 20vh;
            .search-bar {
                margin-top: 1%;
                width: 60%;
                max-width: 50rem;
                margin-bottom: 2rem;
            }
            .more {
                margin-top: 2rem;
                text-decoration: none;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }

}
</style>
