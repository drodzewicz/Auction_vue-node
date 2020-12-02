<template>
    <div class="live-auctioncontainer">
        <h2  class="section-title">Live auctions</h2>
        <spinner-1 v-if="myLiveAuctions.spinner"/>
        <div v-if="!myLiveAuctions.spinner">
            <auction-card-live
                v-for="auction in myLiveAuctions.auctions"
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
            myAuctionPage: 1,
            myLiveAuctions: {
                auctions: [],
                spinner: true
            },
            searchQuery: ""
        };
    },
    created () {
        this.getAllParticipatedInAuction();
    },
    methods: {
        async getAllParticipatedInAuction () {
            this.myLiveAuctions.spinner = true;
            try {
                const response = await this.$http.get("/api/user/live-auctions");
                this.myLiveAuctions.auctions = response.data.auctions;
                this.myLiveAuctions.spinner = false;
            } catch (error) {
                this.myLiveAuctions.spinner = false;
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
}
</style>
