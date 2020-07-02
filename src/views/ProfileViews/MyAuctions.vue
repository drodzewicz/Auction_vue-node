<template>
    <div class="my-auction-container">
        <h2>My Auctions</h2>
        <spinner-1 v-if="auctions.spinner"/>
        <div v-if="!auctions.spinner" class="aucion-box">
            <auction-card-mini
                v-for="li in auctions.list"
                :key="li._id"
                :id="li._id"
                :name="li.name"
                :descriptions="li.description"
                :image="li.image"
                :price="li.price"
                :highestBidder="li.bids.length > 0 ? li.bids[li.bids.length-1].price : null"
                :endDate="new Date(li.endDate)"
            />
            <pagination
                :currentPage="auctions.currentPage"
                :prev="auctions.prevPage"
                :next="auctions.nextPage"
                v-model="auctions.currentPage"
            />
        </div>
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
            auctions: {
                nextPage: null,
                prevPage: null,
                currentPage: 1,
                list: [],
                spinner: true
            }
        };
    },
    created () {
        this.getAllAuthorAuction();
    },
    methods: {
        async getAllAuthorAuction () {
            this.auctions.spinner = true;
            try {
                const resposne = await this.$http.get(`/api/user/my-auctions?limit=5&page=${this.auctions.currentPage}`);
                this.auctions.list = resposne.data.auctions.items;
                this.auctions.nextPage = resposne.data.auctions.next;
                this.auctions.prevPage = resposne.data.auctions.prev;
                this.auctions.spinner = false;
            } catch (error) {
                this.auctions.spinner = false;
            }
        }
    },
    computed: {
        getCurrentPage () {
            return this.auctions.currentPage;
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

    .aucion-box{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        @include breaking-point-md {
            grid-template-columns: 1fr;
        }
        justify-content: center;
        align-items: center;
        max-width: 60rem;
        .auction-link-mini {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .pagination-container {
            grid-column: 1/3;
            @include breaking-point-md {
                grid-column: auto;
            }
        }
    }
}
</style>
