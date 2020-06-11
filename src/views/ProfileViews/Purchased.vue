<template>
    <div class="purhased-auction-container">
        <h2>Purchased auctions</h2>
        <div v-if="!auctions.spinner" class="aucion-box">
            <auction-card-mini
                v-for="li in auctions.list"
                :key="li._id"
                :id="li._id"
                :name="li.name"
                :descriptions="li.description"
                :image="li.image"
                :price="li.price"
                :endDate="new Date(li.endDate)"
            />
            <pagination
                :currentPage="auctions.currentPage"
                :prev="auctions.prevPage"
                :next="auctions.nextPage"
                v-model="auctions.currentPage"
            />
        </div>
    </div>
</template>

<script>
import AuctionCardMini from "@/components/AuctionCards/AuctionCardMini";
import Pagination from "@/components/Pagination";
export default {
    name: "Purchased",
    components: {
        AuctionCardMini,
        Pagination
    },
    data () {
        return {
            auctions: {
                nextPage: null,
                prevPage: null,
                currentPage: 1,
                list: [],
                spinner: true
            }
        };
    },
    created () {
        this.getAllPurchases();
    },
    methods: {
        async getAllPurchases () {
            try {
                const response = await this.$http.get(`/api/user/purchased?limit=5&page=${this.auctions.currentPage}`);
                this.auctions.list = response.data.auctions.items;
                this.auctions.nextPage = response.data.auctions.next;
                this.auctions.prevPage = response.data.auctions.prev;
                this.auctions.spinner = false;
            } catch (error) {
                console.log(error.respnse);
            }
        }
    },
    computed: {
        getCurrentPage () {
            return this.auctions.currentPage;
        }
    },
    watch: {
        getCurrentPage () {
            this.getAllPurchases();
        }
    }
};
</script>

<style lang="scss">
.purhased-auction-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    .aucion-box{
    width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        @include breaking-point-md {
            grid-template-columns: 1fr;
        }
        justify-content: center;
        align-items: center;
        max-width: 60rem;
        .auction-link-mini {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .pagination-container {
            grid-column: 1/3;
            @include breaking-point-md {
                grid-column: auto;
            }
        }
    }
}
</style>
