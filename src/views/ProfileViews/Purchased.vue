<template>
    <profile-sub-page :isEmpty="products.length === 0" title="Purchases" :isLoading="isLoading">
        <div class="aucion-box" slot="content">
            <auction-card-mini
                v-for="auction in products"
                :key="auction._id"
                :id="auction._id"
                :name="auction.name"
                :image="auction.image"
                :price="auction.price"
                :endDate="auction.endDate"
                :buyer="auction.buyer"
            />
        </div>
            <pagination
                slot="pagination"
                :currentPage="currentPage"
                :prev="prevPage"
                :next="nextPage"
                v-model="currentPage"
            />
    </profile-sub-page>
</template>

<script>
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import Pagination from "@/components/Pagination";
import ProfileSubPage from "./ProfileSubPage";
import { bus } from "@/main";

export default {
    name: "Purchased",
    components: {
        AuctionCardMini,
        Pagination,
        ProfileSubPage
    },
    data () {
        return {
            nextPage: null,
            prevPage: null,
            currentPage: 1,
            products: [],
            isLoading: true
        };
    },
    created () {
        this.getAllPurchases();
    },
    methods: {
        async getAllPurchases () {
            this.isLoading = true;
            try {
                const response = await this.$http.get(`/api/user/purchased?limit=5&page=${this.currentPage}`);
                this.products = response.data.auctions.items;
                this.nextPage = response.data.auctions.next;
                this.prevPage = response.data.auctions.prev;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                bus.$emit("changeMessage", "failed to load purchases", "error");
            }
        }
    },
    computed: {
        getCurrentPage () {
            return this.currentPage;
        }
    },
    watch: {
        getCurrentPage () {
            this.getAllPurchases();
        }
    }
};
</script>

<style>
</style>
