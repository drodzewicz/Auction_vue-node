<template>
    <profile-sub-page
        emptyPlaceholder="There are no live auctions"
        :isEmpty="auctions.length === 0"
        title="Live Auctions"
        :isLoading="isLoading">
        <div slot="content">
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
    </profile-sub-page>
</template>

<script>
import { AuctionCardLive } from "@/components/AuctionCards";
import ProfileSubPage from "./ProfileSubPage";

export default {
    name: "MyLiveAuctions",
    components: {
        AuctionCardLive,
        ProfileSubPage
    },
    data () {
        return {
            auctions: [],
            isLoading: true
        };
    },
    created () {
        this.getAllParticipatedInAuction();
    },
    methods: {
        async getAllParticipatedInAuction () {
            this.isLoading = true;
            try {
                const response = await this.$http.get("/api/user/live-auctions");
                this.auctions = response.data.auctions;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
            }
        }
    }
};
</script>
