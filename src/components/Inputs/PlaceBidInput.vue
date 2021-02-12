<template>
    <form class="place-bid-input">
        <button class="primary-btn" type="submit" @click="placeBid">bid</button>
        <span class="currency">{{this.GET_CURRENCY()}}</span>
        <input min="0" type="Number" v-model="price" />
    </form>
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
        placeBid (event) {
            event.preventDefault();
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
    background: rgb(211, 206, 228);
    margin: 1rem 0;
    border-radius: 5px;
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
        font-size: 1rem;
        width: 7rem;
        padding: 0 0.3rem;
        outline: none;
        border-left: solid 1px rgb(155, 155, 155);
        margin: 0.2rem 0;

    }
    .currency {
        margin: 0 0.5rem;
        color: rgb(72, 67, 82);
    }
}
</style>
