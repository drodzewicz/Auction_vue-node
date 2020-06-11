<template>
    <router-link class="auction-link-mini" :to="'/auction/' + this.id">
        <div class="auction-card-mini-container">
            <v-image classes="auction-image" :imageUrl="image" />
            <div class="content-body">
                <h2 class="auction-title">{{name}}</h2>
                <div class="time-count-down-label">
                    <span v-if="!isNaN(endDate)" class="time">Auction</span>
                    <span v-if="isNaN(endDate)" class="time">Buy Now</span>
                    <span class="price">{{formatPrice}}</span>
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
        descriptions: {
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
            type: Date
        }
    },
    computed: {
        ...mapGetters(["GET_CURRENCY"]),
        formatPrice () {
            const choosePrice = this.highestBidder ? this.highestBidder : this.price;
            return `${Math.floor(choosePrice * 100) / 100} ${this.GET_CURRENCY}`;
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
    width: 25rem;
    height: 5rem;
    border-radius: 10px;
    overflow: hidden;
    margin: 1rem 0;
    transition: all ease-in-out 0.3s;
    &:hover {
        box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.5);
    }
    @include mobile {
        width: 100%;
    }

    .auction-image {
        width: 5rem;
        height: 5rem;
        object-fit: cover;
    }
    .content-body {
        display: flex;
        flex-direction: column;
        width: 100%;
        .time-count-down-label {
            background: rgb(220, 220, 220);
            color: $main-dark-blue;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .time {
                margin-left: 1rem;
                font-size: 0.8rem;
                @include mobile {
                    margin-left: 0.3rem;
                }
            }
            .price {
                padding: 0 0.5rem 0 0.4rem;
                background: $main-dark-blue;
                color: white;
                font-size: 0.9rem;
                @include mobile {
                    padding-right: 0.3rem;
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
