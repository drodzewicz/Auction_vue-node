<template>
  <div v-if="startDate!==undefined" class="bidding-container">
        <div class="bid-table-wrapper">
        <div class="banner" :class="{isWinning}">Winning</div>
            <div class="bid-table">
                <span class="live-coundown">
                    <i class="fas fa-clock" />
                    <timer
                        :startDate="new Date(startDate)"
                        :endDate="new Date(endDate)"
                        v-on:timerStatus="setAuctionStatus"
                    />
                </span>
                <place-bid-input v-if="this.isAuctionLive && GET_USER().username && !isUserAuthor" :auctionId="auctionId" />
                <div class="bid-box">
                    <bid-card
                        v-for="bid in bids"
                        :key="bid.id"
                        :timeStamp="new Date(bid.timeStamp)"
                        :price="parseFloat(bid.price)"
                        :username="bid.author.username"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PlaceBidInput } from "@/components/Inputs";
import BidCard from "@/components/BidCard";
import Timer from "@/components/Timer";
import { mapGetters } from "vuex";

export default {
    name: "BidTable",
    components: {
        BidCard,
        PlaceBidInput,
        Timer
    },
    data () {
        return {
            isAuctionLive: false
        };
    },
    props: {
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        bids: {
            type: Array
        },
        auctionId: {
            type: String
        },
        isUserAuthor: {
            type: Boolean
        }
    },
    created () {
        if (this.startDate !== undefined && this.endDate !== undefined) {
            this.isAuctionLive = this.isStarted && !this.isEnded;
        }
    },
    methods: {
        ...mapGetters(["GET_USER"]),
        setAuctionStatus (status) {
            this.isAuctionLive = status;
        }
    },
    computed: {
        isWinning () {
            return this.bids.length !== 0 && this.bids[0].author.username === this.GET_USER().username;
        },
        isEnded () {
            const timeNow = new Date();
            const endDateParsed = new Date(this.endDate);
            return timeNow > endDateParsed;
        },
        isStarted () {
            const timeNow = new Date();
            const startDateParsed = new Date(this.startDate);
            return timeNow >= startDateParsed;
        }
    }
};
</script>

<style lang="scss">
.bidding-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    width: 100%;
    .bid-table-wrapper{
        .banner {
            background: rgb(161, 243, 120);
            color: rgb(32, 64, 28);
            box-shadow: 0 0 0px 0px rgb(219, 255, 165);
            position: absolute;
            z-index: 0;
            height: 3rem;
            padding: 0.2rem 0.5rem;
            border-radius: 10px 10px 0 0 ;
            transition: 0.3s all ease-in-out;
            transform: translateY(70%);
            &.isWinning {
                transform: translateY(0);
                box-shadow: 0 0 3px 2px rgb(219, 255, 165);
            }
        }
    }

    .bid-table {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;
        padding: 0.8rem 1rem;
        box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.211);
        border-radius: 5px;
        width: 20rem;
        min-height: 3rem;
        margin-top: 2rem;
        position: relative;
        .live-coundown {
            display: flex;
            justify-content: center;
            align-items: center;
            .fas {
                font-size: 0.8rem;
                margin-right: 0.3rem;
            }
        }
        .bid-box{
            max-height: 25rem;
            overflow-y: scroll;
            overflow-x: hidden;
            width: 100%;
            padding-right: 1rem;
            &::-webkit-scrollbar {
                height: 0.5em;
                width: 10px;
                }
                &::-webkit-scrollbar-track {
                    background: rgb(216, 217, 241);
                    border-radius: 5px;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: rgb(166, 167, 185);
                    border-radius: 10px;
                }

        }

        .place-bid-input {
            width: 100%;
            input {
                flex-grow: 1;
            }
        }
        .bid-card-container {
            width: 94%;
        }
    }
}
</style>
