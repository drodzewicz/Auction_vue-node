<template>
    <profile-sub-page :isEmpty="auctions.length === 0" title="My Auctions" :isLoaded="spinner">
        <router-link slot="before" class="create-auction" to="/new-auction">Create new auction<i class="fas fa-plus-square"/></router-link>
        <div class="aucion-box" slot="content">
            <auction-card-mini
                v-for="auction in auctions"
                :key="auction._id"
                :id="auction._id"
                :name="auction.name"
                :image="auction.image"
                :price="auction.price"
                :endDate="auction.endDate"
                :buyer="auction.buyer"
            />
        </div>
            <pagination
                slot="pagination"
                :currentPage="currentPage"
                :prev="prevPage"
                :next="nextPage"
                v-model="currentPage"
            />
    </profile-sub-page>

</template>

<script>
import Pagination from "@/components/Pagination";
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import ProfileSubPage from "./ProfileSubPage";

export default {
    name: "MyAuctions",
    components: {
        AuctionCardMini,
        Pagination,
        ProfileSubPage
    },
    data () {
        return {
            nextPage: null,
            prevPage: null,
            currentPage: 1,
            auctions: [],
            spinner: true
        };
    },
    created () {
        this.getAllAuthorAuction();
    },
    methods: {
        async getAllAuthorAuction () {
            this.spinner = true;
            try {
                const resposne = await this.$http.get(`/api/user/my-auctions?limit=8&page=${this.currentPage}`);
                this.auctions = resposne.data.auctions.items;
                this.nextPage = resposne.data.auctions.next;
                this.prevPage = resposne.data.auctions.prev;
                this.spinner = false;
            } catch (error) {
                this.spinner = false;
            }
        }
    },
    computed: {
        getCurrentPage () {
            return this.currentPage;
        }
    },
    watch: {
        getCurrentPage () {
            this.getAllAuthorAuction();
        }
    }
};
</script>

<style lang="scss">
.product-sub-page-container{
    .create-auction {
        text-decoration: none;
        margin-bottom: 2rem;
        background: $main-dark-blue;
        color: rgb(207, 209, 231);
        padding: 0.2rem 0.6rem;
        border-radius: 5px;
        transition: all 0.3s ease-in-out;
        display: flex;
        place-items: center;
        .fas {
            font-size: 0.9rem;
            margin-left: 0.3rem;
        }
        &:hover {
            $lightblue: lighten($main-dark-blue, 20%);
            background: $lightblue;
            color: white;
            box-shadow: 0 0 3px 1px rgba($lightblue, 0.5);
        }
    }
}
</style>
