<template>
    <div class="auction-show-wrapper">
      <spinner-1  v-if="spinner" />
      <div  v-if="!spinner" class="auction-show-container">
        <section class="auction-image">
            <v-image :imageUrl="image" />
        </section>
        <section class="auction-description">
            <h2 class="auction-title">{{name}}</h2>
            <div v-if="startDate" class="end-date">
                <strong>Auction start date:</strong>
                <span>{{formatedDate(this.startDate)}}</span>
            </div>
            <div v-if="endDate" class="end-date">
                <strong>Auction end date:</strong>
                <span>{{formatedDate(this.endDate)}}</span>
            </div>
            <div class="end-date">
                <strong>Author:</strong>
                <span>{{this.author}}</span>
            </div>
            <div class="price">
                <strong v-if="startDate!==undefined">Initial price:</strong>
                <strong v-if="startDate===undefined">Price:</strong>
                <span>
                    {{price}}
                    <span class="currency">{{this.GET_CURRENCY()}}</span>
                </span>
                <button
                    v-if="startDate===undefined && buyer===undefined && getUser() && !isUserAuthor"
                    class="buy-now-btn primary-btn"
                    @click="buyAuction"
                >Buy Now</button>
            </div>
            <div v-if="shouldDisplayBuyer" class="end-date">
                <strong>Buyer:</strong>
                <span>{{this.buyer}}</span>
            </div>
            <div class="description-body">
                <strong>Description:</strong>
                <span>{{description}}</span>
            </div>
            <!-- <router-link
                v-if="!isUserAuthor"
                class="secondary-btn"
                to="/new-auction"
            >Contact seller</router-link> -->
            <router-link
                v-if="isEditable"
                class="edit-btn secondary-btn"
                :to="'/auction/'+id+'/edit'"
            ><i class="fas fa-edit"></i> Edit</router-link>
        </section>
        <div v-if="startDate!==undefined" class="bidding-container">
          <div class="bid-table-wrapper">
            <div class="banner" :class="{isWinning}">Winning</div>
              <div class="bid-table">
                  <span class="live-coundown">
                    <timer
                      v-if="!spinner"
                      :startDate="new Date(startDate)"
                      :endDate="new Date(endDate)"
                      v-on:timerStatus="setAuctionStatus"
                    />
                  </span>
                  <place-bid-input v-if="this.isAuctionLive && getUser() && !isUserAuthor" :auctionId="id" />
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
      </div>
    </div>
</template>

<script>
import { PlaceBidInput } from "@/components/Inputs";
import BidCard from "@/components/BidCard";
import moment from "moment";
import VImage from "@/components/VImage";
import Timer from "@/components/Timer";
import { Spinner1 } from "@/components/Spinners";
import { mapGetters } from "vuex";
import { bus } from "../main";
export default {
    name: "AuctionShow",
    components: {
        BidCard,
        PlaceBidInput,
        VImage,
        Timer,
        Spinner1
    },
    data () {
        return {
            spinner: true,
            isAuctionLive: false,
            id: null,
            name: "",
            description: "",
            image: "",
            price: null,
            endDate: "",
            startDate: "",
            author: "",
            buyer: "",
            bids: []
        };
    },
    created () {
        this.getAuctionInfo();
    },
    beforeDestroy () {
        clearInterval(this.liveCounDownInterval);
        this.leaveBiddingRoom();
    },
    computed: {
        isStarted () {
            const timeNow = new Date();
            const startDateParsed = new Date(this.startDate);
            return timeNow >= startDateParsed;
        },
        isEnded () {
            const timeNow = new Date();
            const endDateParsed = new Date(this.endDate);
            return timeNow > endDateParsed;
        },
        isUserAuthor () {
            return this.getUser() === this.author;
        },
        isEditable () {
            return !this.isStarted && this.isUserAuthor && (this.buyer === "" || this.buyer === undefined);
        },
        shouldDisplayBuyer () {
            const autionEnededAndBUyerIsNotNUll = this.isEnded && (this.buyer !== "" || this.buyer !== undefined);
            const buyNowBuyerNotnull = (this.endDate === undefined) && (this.startDate === undefined) && this.buyer !== undefined;
            return autionEnededAndBUyerIsNotNUll || buyNowBuyerNotnull;
        },
        isWinning () {
            return this.bids.length !== 0 && this.bids[0].author.username === this.getUser();
        }
    },
    methods: {
        ...mapGetters(["getUser", "GET_CURRENCY"]),
        formatedDate (date) {
            return moment(date).format("LLL");
        },
        setAuctionStatus (status) {
            this.isAuctionLive = status;
        },
        async buyAuction () {
            try {
                const response = await this.$http.patch(`api/auction/${this.id}/buy`);
                bus.$emit("changeMessage", response.data.msg, "success");
                this.buyer = this.getUser();
            } catch (error) {
                bus.$emit("changeMessage", "failed to buy auction", "error");
            }
        },
        async getAuctionInfo () {
            try {
                const response = await this.$http.get(`/api/auction/${this.$route.params.id}`);
                const { _id, name, description, image, price, endDate, startDate, bids, author, buyer } = response.data;
                this.id = _id;
                this.name = name;
                this.description = description;
                this.image = image;
                this.price = price;

                this.endDate = endDate !== undefined ? new Date(endDate) : undefined;
                this.startDate = startDate !== undefined ? new Date(startDate) : undefined;
                this.bids = bids.reverse();
                this.author = author !== undefined ? author.username : undefined;
                this.buyer = buyer !== undefined ? buyer.username : undefined;

                this.joinBiddingRoom();

                if (this.startDate !== undefined && this.endDate !== undefined) {
                    this.isAuctionLive = this.isStarted && !this.isEnded;
                }
                this.spinner = false;
            } catch (error) {
                bus.$emit("changeMessage", "failed to buy auction", "error");
                this.spinner = false;
                this.$router.replace("/error-notfound");
            }
        },
        sendBid (data) {
            this.bids.unshift(data);
        },
        joinBiddingRoom () {
            this.$sock.emit("joinBidding", { room: this.id });
            this.$sock.on("sendBid", this.sendBid);
        },
        leaveBiddingRoom () {
            this.$sock.emit("leaveBidding", {
                room: this.id
            });
            this.$sock.removeListener("sendBid", this.senfBid);
        }
    }
};
</script>

<style lang="scss">
.auction-show-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .spinner-1{
        align-self: center;
    }
}
.auction-show-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    max-width: 100rem;
    @include breaking-point-sm {
        flex-direction: column;
    }
    .buy-now-btn {
        font-size: 1rem;
        margin-top: 0.5rem;
    }
    .auction-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 2rem;
        @include breaking-point-sm {
            width: auto;
            margin-right: 0;
        }

        img {
            width: 20rem;
            height: 15rem;
            object-fit: cover;
            border-radius: 30px;
            box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.17);
            margin-top: 1rem;
        }
    }
    .auction-description {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 1rem 0;
        margin-left: 2rem;
        @include breaking-point-sm {
            width: 20rem;
            margin-left: 0;
        }

        .auction-title {
            margin: 0;
        }
        .price,
        .end-date,
        .description-body {
            display: flex;
            flex-direction: column;
            margin: 0.5rem 0;
            strong {
                font-size: 0.8rem;
            }
            span {
                font-family: "Roboto", sans-serif;
            }
        }

        .description-body {
            span {
                color: grey;
            }
            max-height: 12rem;
            overflow-y: scroll;
        }
        .secondary-btn {
            margin-top: 1rem;
            font-size: 1.2rem;
            align-self: center;
        }
        .edit-btn {
            align-self: flex-start;
        }
    }

    .bidding-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
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
            border-radius: 20px;
            width: 20rem;
            min-height: 3rem;
            margin-top: 2rem;
            position: relative;
            .bid-box{
                max-height: 30rem;
                overflow-y: scroll;
                overflow-x: hidden;
                width: 100%;
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
}
</style>
