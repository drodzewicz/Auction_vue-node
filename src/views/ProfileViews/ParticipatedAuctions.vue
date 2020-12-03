<template>
    <div class="participated-auction-container">
        <h2  class="section-title">Participated auctions</h2>
        <div v-if="spinner" class="spinner-wrapper">
            <spinner-1 />
        </div>
        <div v-if="!spinner" class="aucion-box">
            <auction-card-mini
                v-for="li in products"
                :key="li._id"
                :id="li._id"
                :name="li.name"
                :descriptions="li.description"
                :image="li.image"
                :price="li.price"
            />
        </div>
         <pagination
                :currentPage="currentPage"
                :prev="prevPage"
                :next="nextPage"
                v-model="currentPage"
            />
    </div>
</template>

<script>
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import Pagination from "@/components/Pagination";
import { Spinner1 } from "@/components/Spinners";
export default {
    name: "MyAuctions",
    components: {
        AuctionCardMini,
        Pagination,
        Spinner1
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

<style lang="scss">
.participated-auction-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .aucion-box{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(4, 5.5rem);
        gap: 0.8rem;

        @include mobile {
            grid-template-columns: 1fr;
        }
        }
}

</style>
