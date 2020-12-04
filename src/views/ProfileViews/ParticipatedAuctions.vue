<template>
    <profile-sub-page :isEmpty="products.length === 0" title="Participations" :isLoaded="spinner">
        <div class="aucion-box" slot="content">
            <auction-card-mini
                v-for="prod in products"
                :key="prod._id"
                :id="prod._id"
                :name="prod.name"
                :image="prod.image"
                :price="prod.price"
                :endDate="prod.endDate"
                :buyer="prod.buyer"
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
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import Pagination from "@/components/Pagination";
import ProfileSubPage from "./ProfileSubPage";

export default {
    name: "Participations",
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
            products: [],
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
                const response = await this.$http.get(`/api/user/participations?limit=5&page=${this.currentPage}`);
                this.products = response.data.auctions.items;
                this.nextPage = response.data.auctions.next;
                this.prevPage = response.data.auctions.prev;
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
