<template>
    <router-link class="auction-link-mini" :to="'/auction/' + this.id">
        <div class="auction-card-mini-container">
            <div class="image-wrapper">
                <div class="tag-wrapper">
                    <img v-if="isSold" class="sold-tag" src="@/assets/sold_image.png" alt="sold">
                </div>
                <v-image classes="auction-image" :imageUrl="image" />
            </div>
            <div class="content-body">
                <h2 class="auction-title">{{name}}</h2>
                <div class="product-tags" :class="{auction: !endDate}">
                    <span v-if="!!endDate" class="tag auction">Auction</span>
                    <span v-if="!endDate" class="tag buy">Buy Now</span>
                    <span class="price">{{formatPrice}}<span class="currency">{{this.GET_CURRENCY}}</span></span>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
import VImage from "@/components/VImage";
import { mapGetters } from "vuex";
export default {
    name: "AuctionCard",
    components: {
        VImage
    },
    props: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        image: {
            type: String
        },
        price: {
            type: Number
        },
        highestBidder: {
            type: Number
        },
        endDate: {
            type: String,
            default: undefined
        },
        buyer: {
            type: Object
        }
    },
    computed: {
        ...mapGetters(["GET_CURRENCY"]),
        formatPrice () {
            const choosePrice = this.highestBidder ? this.highestBidder : this.price;
            return `${Math.floor(choosePrice * 100) / 100}`;
        },
        isEnded () {
            const timeNow = new Date();
            const endDateParsed = new Date(this.endDate);
            return timeNow > endDateParsed;
        },
        isSold () {
            const autionEnededAndBUyerIsNotNUll = this.isEnded && this.buyer !== undefined;
            const buyNowBuyerNotnull = !this.endDate && this.buyer !== undefined;
            return autionEnededAndBUyerIsNotNUll || buyNowBuyerNotnull;
        }
    }
};
</script>

<style lang="scss">
.auction-link-mini {
    text-decoration: none;
}

.auction-card-mini-container {
    cursor: pointer;
    background: white;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.32);
    display: flex;
    flex-direction: row;
    width: 20rem;
    min-width: 20rem;
    height: 5rem;
    border-radius: 5px;
    overflow: hidden;
    transition: all ease-in-out 0.3s;
    &:hover {
        box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.5);
    }
    @include mobile {
        width: 100%;
    }
    .image-wrapper {
        position: relative;
        .tag-wrapper {
            position: absolute;
            background: rgba(255, 255, 255, 0.445);
            width: 100%;
            height: 100%;
            display: flex;
            place-items: center;
            justify-content: center;
            .sold-tag {
                 height: 3.5rem;
            }
        }
        .auction-image {
            width: 5rem;
            height: 5rem;
            object-fit: cover;
        }
    }

    .content-body {
        display: flex;
        flex-direction: column;
        width: 100%;
        .product-tags {
             background: rgb(255, 221, 148);
            color: $main-dark-blue;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .tag  {
                font-size: 0.8rem;
                padding: 0.1rem 0.4rem;
                color: rgb(51, 51, 59);
            }
            .price {
                padding: 0 0.5rem 0 0.4rem;
                background: $main-yellow;
                color: $main-dark-blue;
                font-size: 0.8rem;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                @include mobile {
                    padding-right: 0.3rem;
                }
                .currency {
                    font-size: 0.6rem;
                    margin-left: 3px;
                }
            }
            &.auction {
                background: rgb(163, 152, 255);
                .tag  {
                    color: rgb(39, 37, 53);
                }
                .price {
                    color: white;
                    background: $main-dark-blue;
                 }
            }
        }
        .auction-title {
            flex-grow: 1;
            color: $main-dark-blue;
            margin: 0;
            margin-left: 0.5rem;
            font-size: 1rem;
        }
    }
}
</style>
