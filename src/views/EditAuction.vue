<template>
    <auction-editor @submitData="updateAuction" @deleteProduct="deleteAuction" method="UPDATE" />
</template>

<script>
import { mapGetters } from "vuex";
import { bus } from "../main";
import AuctionEditor from "./AuctionEditor";

export default {
    name: "EditAuction",
    components: {
        AuctionEditor
    },
    methods: {
        ...mapGetters(["getUser"]),
        async updateAuction (data) {
            const { name, description, tags, image, price, startDate, endDate } = data;
            const updatedAuction = { name, description, tags, image, price, startDate, endDate };
            try {
                const response = await this.$http.put(`/api/auction/${this.$route.params.id}`, updatedAuction);
                bus.$emit("changeMessage", "succesfully updated auction", "success");
                this.$router.push(`/auction/${response.data.auction._id}`);
            } catch (error) {
                let errorMsg = "something went wrong";
                if (error.response.data.msg.endDate !== undefined) {
                    errorMsg = error.response.data.msg.endDate;
                } else if (error.response.data.msg.startDate !== undefined) {
                    errorMsg = error.response.data.msg.startDate;
                }
                bus.$emit("changeMessage", errorMsg, "error");
            }
        },
        async deleteAuction () {
            try {
                const response = await this.$http.delete(`/api/auction/${this.$route.params.id}`);
                bus.$emit("changeMessage", response.data.msg, "success");
                this.$router.push("/profile/my-auctions");
            } catch (error) {
                if (error.response.data.msg !== "" || error.response.data.msg !== undefined) {
                    bus.$emit("changeMessage", error.response.data.msg, "error");
                }
            }
        }
    }
};
</script>

<style lang="scss">
</style>
