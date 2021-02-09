<template>
    <div class="auctions-container">
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

    .search-bar {
        margin-top: 1%;
        width: 60%;
        max-width: 50rem;
        margin: 0 auto;
        z-index: 10;
        position: relative;
    }
    .product-container{
        margin-top: 2rem;
    }

}
</style>
