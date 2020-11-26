<template>
    <div class="auctions-container">
        <div class="search-filter-container">
        </div>
        <section class="all-offers">
            <img class="wave-bg" src="@/assets/wave_bg.svg" alt="wave">
            <div class="offer-wrapper">
                <search-bar v-model="searchQuery" @search="execSearch" />
                <spinner-1 v-if="spinner" />
                <product-container v-if="!spinner" :auctions=auctions />
                 <pagination
                    :currentPage="page.current"
                    :prev="page.prev"
                    :next="page.next"
                    v-model="page.current"
                />
            </div>
        </section>
    </div>
</template>

<script>
import { Spinner1 } from "@/components/Spinners";
import { mapGetters } from "vuex";
import ProductContainer from "@/components/ProductContainer";
import SearchBar from "@/components/Inputs/SearchBar";
import Pagination from "@/components/Pagination";

export default {
    name: "Auctions",
    components: {
        ProductContainer,
        Spinner1,
        SearchBar,
        Pagination
    },
    data () {
        return {
            auctions: [],
            page: {
                current: 1,
                prev: null,
                next: null
            },
            spinner: true,
            searchQuery: ""
        };
    },
    created () {
        this.fetchAuctions();
    },
    methods: {
        ...mapGetters(["getUser"]),
        execSearch () {
            console.log(this.searchQuery);
        },
        async fetchAuctions () {
            this.spinner = true;
            try {
                const reposne = await this.$http.get("/api/auction?page=1&limit=8&finished=false");
                const { items, next, prev } = reposne.data.auctions;
                this.auctions = items;
                this.spinner = false;
                this.page.next = next;
                this.page.prev = prev;
            } catch (error) {
                this.spinner = false;
            }
        }
    }
};
</script>

<style lang="scss">
.auctions-container {
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .all-offers {
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
