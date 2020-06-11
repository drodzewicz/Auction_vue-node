<template>
    <router-link class="auction-link" :to="'/auction/' + this.id">
        <div class="auction-card-container">
            <div class="card-overlay">
                <h2 class="auction-title">{{name}}</h2>
                <section class="description">{{descriptions}}</section>
            </div>
            <v-image classes="auction-image" :imageUrl="image" />
            <div class="content-body">
                <h2 class="auction-title">{{name}}</h2>
            </div>
            <div class="time-count-down-label">
                <span class="time">
                  <timer
                      :startDate="new Date(startDate)"
                      :endDate="new Date(endDate)"
                    />
                </span>
                <span class="price">{{`${price} ${GET_CURRENCY()}`}}</span>
            </div>
        </div>
    </router-link>
</template>

<script>
import VImage from "@/components/VImage";
import Timer from "@/components/Timer";
import { mapGetters } from "vuex";
export default {
    name: "AuctionCard",
    components: {
        VImage,
        Timer
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
        endDate: {
            type: Date
        },
        startDate: {
            type: Date
        }
    },
    data () {
        return {
            liveCounDownInterval: null
        };
    },
    created () {
    },
    beforeDestroy () {
        clearInterval(this.liveCounDownInterval);
    },
    methods: {
        ...mapGetters(["GET_CURRENCY"])
    }
};
</script>

<style lang="scss">
$card-height: 15rem;
$card-width: 20rem;
.auction-link {
    text-decoration: none;

    &:hover {
        .card-overlay {
            opacity: 1;
        }
        .time-count-down-label {
            bottom: 0.5rem;
        }
        .auction-image {
            height: $card-height;
        }
    }
}
.card-overlay {
    position: absolute;
    width: $card-width;
    height: $card-height;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: 0.4s all ease-in-out;
    .description {
        font-family: "Roboto", sans-serif;
        color: white;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 0.5rem 0.6rem;
        max-height: 7rem;
        overflow: hidden;
    }

    .auction-title {
        margin: 0.5rem 0.6rem;
        color: white;
    }
}
.auction-card-container {
    background: white;
    box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.286);
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    margin: 1.5rem 0.5rem;
    width: $card-width;
    height: $card-height;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    .auction-image {
        width: 100%;
        height: 11rem;
        object-fit: cover;
        border-radius: 15px 15px 0 0;
        transition: all 0.3s ease-in-out;
    }
    .content-body {
        padding: 0.2rem 0.8rem;

        .auction-title {
            font-size: 1.2rem;
            margin: 0;
            color: $main-dark-blue;
        }
    }

    .time-count-down-label {
        background: $main-light-grey;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2.5rem;
        position: absolute;
        right: 0;
        bottom: 3.5rem;
        box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.217);
        border-radius: 15px 0 0 15px;
        transition: all 0.3s ease-in-out;

        .price {
            background: $main-dark-blue;
            color: white;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 0.6rem;
        }
        .time {
            margin: 0 1rem;
            color: $main-dark-blue;
        }
    }
}
</style>
