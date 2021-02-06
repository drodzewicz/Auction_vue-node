<template>
    <div class="auction-show-wrapper">
      <spinner-1  v-if="spinner" />
      <div  v-if="!spinner" class="auction-show-container">
        <section class="auction-details">
            <div class="image-wrapper">
                <v-image class="product-image" :class="{sold: shouldDisplayBuyer}" :imageUrl="image" />
                <img v-if="shouldDisplayBuyer" class="sold-tag" src="@/assets/sold_image.png" alt="">
                <div class="user-bar author-bar">
                    <VImage imageUrl="" defaultImage="/default_avatar_image.svg"  />
                    <span>{{this.author}}</span>
                </div>
            </div>
            <div class="price-and-buttins">
                <div class="price">
                    <span>{{`${price} ${this.GET_CURRENCY()}`}}</span>
                </div>
                <button
                    v-if="startDate===undefined && buyer===undefined && getUser() && !isUserAuthor"
                    @click="buyAuction"
                    class="buynow-btn"
                >Buy Now</button>
                <router-link
                    v-if="isEditable"
                    class="edit-btn secondary-btn"
                    :to="'/auction/'+id+'/edit'"
                ><i class="fas fa-edit"></i> Edit</router-link>
                <router-link
                    v-if="shouldDisplayBuyer && isUserAuthor"
                    class="contact-btn secondary-btn"
                    :to="'/chat/'+buyer"
                ><i class="fas fa-edit"></i>Contact Buyer</router-link>
            </div>
            <div class="text-details">
                <h2 class="ptoduct-title">{{name}}</h2>
                <div class="dates">
                    <div class="date date-start">
                        <span class="label">Auction starts:</span>
                        <span class="calendar">
                            <i class="fas fa-calendar-alt" />
                            <span>{{getDateDate(this.startDate)}}</span>
                        </span>
                        <span class="time">
                            <i class="fas fa-clock" />
                            <span>{{getDateTime(this.startDate)}}</span>
                        </span>
                    </div>
                    <div class="date date-end">
                        <span class="label">Auction ends:</span>
                        <span class="calendar">
                            <i class="fas fa-calendar-alt" />
                            <span>{{getDateDate(this.endDate)}}</span>
                        </span>
                        <span class="time">
                            <i class="fas fa-clock" />
                            <span>{{getDateTime(this.endDate)}}</span>
                        </span>
                    </div>
                </div>
                <p class="product-description">{{description}}</p>
            </div>
        </section>
        <bid-table
            :endDate="endDate"
            :startDate="startDate"
            :bids="bids"
            :auctionId="id"
            :isUserAuthor="isUserAuthor"
         />
      </div>
    </div>
</template>

<script>
import moment from "moment";
import VImage from "@/components/VImage";
import { Spinner1 } from "@/components/Spinners";
import { mapGetters } from "vuex";
import { bus } from "@/main";
import BidTable from "./BidTable";

export default {
    name: "AuctionShow",
    components: {
        VImage,
        Spinner1,
        BidTable
    },
    data () {
        return {
            spinner: true,
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
        this.$sock.removeListener("sendBid", this.sendBid);
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
        }
    },
    methods: {
        ...mapGetters(["getUser", "GET_CURRENCY"]),
        getDateDate (date) {
            return moment(date).format("MM-DD-YYYY");
        },
        getDateTime (date) {
            return moment(date).format("hh:mm");
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
            this.$sock.emit("leaveBidding", { room: this.id });
        }
    }
};
</script>

<style lang="scss">
.auction-show-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    .contact-btn {
        font-size: 1rem;
        .fas {
            font-size: 0.8rem;
            margin-bottom: 0.2rem;
            margin-right: 0.2rem;
        }
    }
    .auction-show-container{
        display: flex;
        flex-direction: row;
        margin-top: 3rem;
        & > * {
            margin: 0 2rem;
        }
        .price {
            background: $main-yellow;
            color: $main-dark-blue;
            padding: 0.1rem 0.7rem;
            border-radius: 5px;
            font-size: 1.2rem;
            box-shadow: 0 0 3px 1px rgba($main-yellow, 0.5);
        }
        .buynow-btn {
            background: #2BB439;
            color: white;
            border: none;
            padding: 0.2rem 0.7rem;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Secular One', sans-serif;
            transition: all 0.3s ease-in-out;
            outline: none;
            &:hover {
                background: #3ece4d;
                box-shadow: 0 0 4px 1px rgba( #3ece4d, 0.5);

            }
        }
        @include breaking-point-sm {
            flex-direction: column;
            & > * {
                margin: 1rem 0;
            }
        }
        .auction-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            .user-bar {
                    background: rgb(255, 255, 255);
                    padding: 0.2rem 0.4rem;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: row;
                    place-items: center;
                    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.089);
                    &.author-bar {
                        position: absolute;
                        left: 0.5rem;
                        bottom: 0.5rem;
                    }
                    img {
                       height: 1rem;
                        width: 1rem;
                        object-fit: cover;
                        border-radius: 10rem;
                        margin-right: 0.3rem;
                    }
                    span {
                        font-size: 1rem;
                        color: #202020;
                    }
                }
            .image-wrapper {
                $image-height: 15rem;
                $image-width: 23rem;
                position: relative;
                height: $image-height;
                width: $image-width;
                position: relative;
                .sold-tag {
                    position: absolute;
                    height: 8rem;
                    width: 11rem;
                    object-fit: contain;
                    transform: translate(-$image-width/2 - 5.5rem, 3rem);
                }
                .product-image {
                    height: $image-height;
                    width: $image-width;
                    object-fit: cover;
                    border-radius: 5px;
                    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.432);
                    &.sold {
                       opacity: 0.6;
                    }
                }
            }
            .price-and-buttins {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                margin-top: 1rem;
            }
            .text-details {
                width: 100%;
                margin-top: 1rem;
                .ptoduct-title {
                    margin: 0;
                    color: #202020;
                }
                .product-description {
                    margin: 0;
                    color: #636363;
                    font-size: 0.9rem;
                }
                .dates {
                    display: flex;
                    margin: 0.5rem 0;
                    .date {
                        display: flex;
                        flex-wrap: wrap;
                        width: 10rem;
                        &.date-end {
                            margin-left: 1rem;
                        }
                        .label {
                            flex-basis: 100%;
                            width: 0;
                            font-size: 0.8rem;
                            color: rgb(61, 61, 61);
                        }
                        .calendar, .time {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 0.9rem;
                        }
                        .fas {
                            font-size: 0.7rem;
                            margin-right: 0.2rem;
                            margin-bottom: 0.1rem;
                            &.fa-clock {
                                margin-left: 0.6rem;
                            }
                        }
                    }
                }
            }
        }

    }

}
</style>
