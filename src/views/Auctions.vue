<template>
    <div class="auctions-container">
        <spinner-1 v-if="isLoading" />
        <product-container v-if="!isLoading" :auctions=auctions />
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
import Pagination from "@/components/Pagination";

export default {
    name: "Auctions",
    components: {
        ProductContainer,
        Spinner1,
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
            isLoading: true
        };
    },
    created () {
        this.fetchAuctions();
    },
    methods: {
        ...mapGetters(["getUser"]),
        async fetchAuctions () {
            this.isLoading = true;
            try {
                const reposne = await this.$http.get(`/api/auction?page=${this.page.current}&limit=16&finished=false`);
                const { items, next, prev } = reposne.data.auctions;
                this.auctions = items;
                this.isLoading = false;
                this.page.next = next;
                this.page.prev = prev;
            } catch (error) {
                this.isLoading = false;
            }
        }
    },
    computed: {
        getCurrentPage () {
            return this.page.current;
        }
    },
    watch: {
        getCurrentPage () {
            this.fetchAuctions();
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
    .pagination-container {
        margin-top: 1rem;
        margin-bottom: 3rem;
    }

}
</style>
