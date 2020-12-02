<template>
    <div class="my-auction-container">
        <h2 class="section-title">My Auctions</h2>
        <div v-if="spinner" class="spinner-wrapper">
            <spinner-1 />
        </div>
        <div v-if="!spinner" class="aucion-box">
            <auction-card-mini
                v-for="auction in auctions"
                :key="auction._id"
                :id="auction._id"
                :name="auction.name"
                :descriptions="auction.description"
                :image="auction.image"
                :price="auction.price"
                :highestBidder="auction.bids.length > 0 ? auction.bids[auction.bids.length-1].price : null"
                :endDate="auction.endDate"
                :buyer="auction.buyer"
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
import Pagination from "@/components/Pagination";
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import { Spinner1 } from "@/components/Spinners";
export default {
    name: "MyAuctions",
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
            auctions: [],
            spinner: true
        };
    },
    created () {
        this.getAllAuthorAuction();
    },
    methods: {
        async getAllAuthorAuction () {
            this.spinner = true;
            try {
                const resposne = await this.$http.get(`/api/user/my-auctions?limit=8&page=${this.currentPage}`);
                this.auctions = resposne.data.auctions.items;
                this.nextPage = resposne.data.auctions.next;
                this.prevPage = resposne.data.auctions.prev;
                this.spinner = false;
            } catch (error) {
                this.spinner = false;
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
            this.getAllAuthorAuction();
        }
    }
};
</script>

<style lang="scss">
.my-auction-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .spinner-wrapper {
        display: flex;
        place-items: center;
        height: 24.4rem;
    }
    .aucion-box{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(4, 5.5rem);
        gap: 0.8rem;

        @include mobile {
            grid-template-columns: 1fr;
        }
        .auction-link-mini {
        }
        .pagination-container {
    }
}
}
</style>
