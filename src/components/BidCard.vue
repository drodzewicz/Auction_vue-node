<template>
    <div class="bid-card-container">
        <div class="text-content">
            <strong class="username">{{username}}</strong>
            <span class="time-stamp">{{momentTime}}</span>
        </div>
        <div class="price-label">
            {{this.formatPrice}}
            <span class="currency">{{this.GET_CURRENCY}}</span>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
export default {
    name: "BidCard",
    props: {
        username: {
            type: String
        },
        price: {
            type: Number
        },
        timeStamp: {
            type: Date,
            default: Date.now()
        }
    },
    computed: {
        ...mapGetters(["GET_CURRENCY"]),
        momentTime () {
            return moment(this.timeStamp).fromNow();
        },
        formatPrice () {
            return Math.floor(this.price * 100) / 100;
        }
    }
};
</script>

<style lang="scss">
.bid-card-container {
    background: $main-light-grey;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0.2rem 0.6rem;
    margin: 0.4rem;
    border-radius: 10px;
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.238);
    overflow: hidden;
    width: 15rem;
    .text-content {
        display: flex;
        flex-direction: column;
        .username {
            color: $main-dark-blue;
            font-size: 0.8rem;
        }
        .time-stamp {
            font-size: 0.6rem;
            color: grey;
        }
    }
    .price-label {
        font-size: 1rem;
        color: $main-dark-blue;
        background: $main-yellow;
        padding: 0.2rem 0.4rem;
        border-radius: 6px;
        .currency {
            margin-left: 0.1rem;
            font-size: 0.8rem;
        }
        box-shadow: 0 0 3px 1px rgb(255, 255, 116);
    }
}
</style>
