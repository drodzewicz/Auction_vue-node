<template>
    <auction-editor @submitData="createAuction" />
</template>

<script>
import { bus } from "../main";
import AuctionEditor from "./AuctionEditor";

export default {
    name: "NewAuction",
    components: {
        AuctionEditor
    },
    methods: {
        async createAuction (data) {
            const { name, description, tags, image, price, startDate, endDate } = data;
            this.spinner = true;
            try {
                const response = await this.$http.post("/api/auction", { name, description, tags, image, price, startDate, endDate });
                this.spinner = false;
                this.$router.push(`/auction/${response.data.auction._id}`);
            } catch (err) {
                let errorMsg = "something went wrong";
                if (err.response.data.msg.endDate !== undefined) {
                    errorMsg = err.response.data.msg.endDate;
                } else if (err.response.data.msg.startDate !== undefined) {
                    errorMsg = err.response.data.msg.startDate;
                }
                bus.$emit("changeMessage", errorMsg, "error");
                this.spinner = false;
            }
        }
    }
};
</script>

<style>

</style>
