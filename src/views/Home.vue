<template>
    <div class="home-container">
        <div class="btn-container">
            <router-link v-if="getUsername" class="primary-btn" to="/new-auction">Create new auction</router-link>
        </div>
        <spinner-1 v-if="auctions.spinner"/>
        <div v-if="!auctions.spinner" class="home-auction-container">
            <auction-card
                v-for="li in auctions.list"
                :key="li._id"
                :id="li._id"
                :name="li.name"
                :descriptions="li.description"
                :image="li.image"
                :price="li.bids.length > 0 ? li.bids[li.bids.length - 1].price : li.price"
                :endDate="new Date(li.endDate)"
                :startDate="new Date(li.startDate)"
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
import { AuctionCard } from "@/components/AuctionCards";
import Pagination from "@/components/Pagination";
import { Spinner1 } from "@/components/Spinners";
import { mapGetters } from "vuex";

export default {
    name: "Home",
    components: {
        AuctionCard,
        Pagination,
        Spinner1
    },
    data () {
        return {
            auctions: {
                nextPage: null,
                prevPage: null,
                currentPage: 1,
                list: [],
                spinner: true
            },
            searchQuery: ""
        };
    },
    created () {
        this.fetchAuctions();
    },
    methods: {
        ...mapGetters(["getUser"]),
        async fetchAuctions () {
            this.auctions.spinner = true;
            try {
                const reposne = await this.$http.get(`/api/auction?page=${this.auctions.currentPage}&limit=6&finished=false`);
                const { items, next, prev } = reposne.data.auctions;
                this.auctions.list = items;
                this.auctions.nextPage = next;
                this.auctions.prevPage = prev;
                this.auctions.spinner = false;
            } catch (error) {
                this.auctions.spinner = false;
            }
        }
    },
    watch: {
        getCurrentPage () {
            this.fetchAuctions();
        }
    },
    computed: {
        getUsername () {
            return this.getUser();
        },
        getCurrentPage () {
            return this.auctions.currentPage;
        }
    }
};
</script>

<style lang="scss">
.home-container {
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .load-more {
        font-family: "Secular One", sans-serif;
        color: $main-dark-blue;
        background: transparent;
        outline: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
    .home-auction-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0 5%;
        justify-content: center;
        & > * {
            margin: 0 1rem;
        }
        .pagination-container {
          align-self: flex-end;
        }
    }
    .btn-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        & > * {
            margin: 1rem 0;
        }
    }
    .search-bar {
        @include mobile {
            width: 20rem;
        }
        input {
            width: 25rem;
            @include mobile {
                width: auto;
            }
        }
    }
}
</style>
