<template>
    <div class="purhased-auction-container">
        <h2  class="section-title">Purchased auctions</h2>
        <div v-if="spinner" class="spinner-wrapper">
            <spinner-1 />
        </div>
        <div v-if="!spinner" class="aucion-box">
            <auction-card-mini
                v-for="li in products"
                :key="li._id"
                :id="li._id"
                :name="li.name"
                :image="li.image"
                :price="li.price"
            />
        </div>
         <pagination
                :currentPage="currentPage"
                :prev="prevPage"
                :next="nextPage"
                v-model="currentPage"
            />
    </div>
</template>

<script>
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import Pagination from "@/components/Pagination";
import { bus } from "../../main";
import { Spinner1 } from "@/components/Spinners";
export default {
    name: "Purchased",
    components: {
        AuctionCardMini,
        Pagination,
        Spinner1
    },
    data () {
        return {
            nextPage: null,
            prevPage: null,
            currentPage: 1,
            products: [],
            spinner: true
        };
    },
    created () {
        this.getAllPurchases();
    },
    methods: {
        async getAllPurchases () {
            this.spinner = true;
            try {
                const response = await this.$http.get(`/api/user/purchased?limit=5&page=${this.currentPage}`);
                this.products = response.data.auctions.items;
                this.nextPage = response.data.auctions.next;
                this.prevPage = response.data.auctions.prev;
                this.spinner = false;
            } catch (error) {
                this.spinner = false;
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

<style lang="scss">
.purhased-auction-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .aucion-box{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(4, 5.5rem);
        gap: 0.8rem;

        @include mobile {
            grid-template-columns: 1fr;
        }
    }
}
</style>
