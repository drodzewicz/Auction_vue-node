<template>
    <div class="live-auctioncontainer">
        <h2>Live auctions</h2>
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

export default {
    name: "MyLiveAuctions",
    components: {
        AuctionCardLive
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
        getAllParticipatedInAuction () {
            this.$http
                .get("/api/user/live-auctions")
                .then(res => {
                    this.myLiveAuctions.auctions = res.data.auctions;
                    this.myLiveAuctions.spinner = false;
                })
                .catch(err => {
                    console.log(err.respnse);
                });
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
