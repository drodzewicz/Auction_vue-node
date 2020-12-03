<template>
    <div class="live-auctioncontainer">
        <h2  class="section-title">Live auctions</h2>
        <div v-if="spinner" class="spinner-wrapper">
            <spinner-1 />
        </div>
        <div v-if="!spinner" class="live-auction-box">
            <auction-card-live
                v-for="auction in auctions"
                :key="auction._id"
                :id="auction._id"
                :name="auction.name"
                :image="auction.image"
                :price="auction.price"
                :endDate="new Date(auction.endDate)"
                :bids="auction.bids"
            />
        </div>
    </div>
</template>

<script>
import { AuctionCardLive } from "@/components/AuctionCards";
import { Spinner1 } from "@/components/Spinners";

export default {
    name: "MyLiveAuctions",
    components: {
        AuctionCardLive,
        Spinner1
    },
    data () {
        return {
            auctions: [],
            spinner: true,
            searchQuery: ""
        };
    },
    created () {
        this.getAllParticipatedInAuction();
    },
    methods: {
        async getAllParticipatedInAuction () {
            this.spinner = true;
            try {
                const response = await this.$http.get("/api/user/live-auctions");
                this.auctions = response.data.auctions;
                this.spinner = false;
            } catch (error) {
                this.spinner = false;
            }
        }
    }
};
</script>

<style lang="scss">
.live-auctioncontainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    .live-auction-box {
        margin-top: 2rem;
    }
}
</style>
