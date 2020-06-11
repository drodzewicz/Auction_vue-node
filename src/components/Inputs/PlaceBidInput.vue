<template>
    <div class="place-bid-input">
        <button class="primary-btn" @click="placeBid">bid</button>
        <input min="0" type="Number" v-model="price" />
        <span class="currency">{{this.GET_CURRENCY()}}</span>
    </div>
</template>

<script>
import { bus } from "../../main";
import { mapGetters } from "vuex";
export default {
    name: "PlaceBidInput",
    props: {
        auctionId: {
            type: String
        }
    },
    data () {
        return {
            price: 0
        };
    },
    methods: {
        ...mapGetters(["GET_CURRENCY"]),
        placeBid () {
            this.$sock.emit("liveBid", {
                roomId: this.auctionId,
                bid: this.price
            },
            err => {
                bus.$emit("changeMessage", err, "error");
            });
            this.price = "";
        }
    }
};
</script>

<style lang="scss" >
.place-bid-input {
    background: rgb(177, 177, 177);
    margin: 1rem 0;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .primary-btn {
        border-radius: 0;
        font-size: 1.1rem;
        outline: none;
    }
    input {
        font-family: "Secular One", sans-serif;
        border: none;
        background: transparent;
        font-size: 1.2rem;
        width: 7rem;
        padding: 0 0.3rem;
        outline: none;
    }
    .currency {
        margin-right: 0.5rem;
    }
}
</style>
