<template>
  <div class="product-container">
    <auction-card
        v-for="auction in auctions"
        :key="auction._id"
        :id="auction._id"
        :name="auction.name"
        :descriptions="auction.description"
        :image="auction.image"
        :price="auction.price"
        :endDate="new Date(auction.endDate)"
        :startDate="new Date(auction.startDate)"
    />
  </div>
</template>

<script>
import { AuctionCard } from "@/components/AuctionCards";

export default {
    name: "ProductContainer",
    components: {
        AuctionCard
    },
    props: {
        auctions: {
            type: Array
        }
    }
};
</script>

<style lang="scss">
  .product-container {
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @include breaking-point-md {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @include breaking-point-sm {
      grid-template-columns: 1fr 1fr;
    }
    @include mobile {
      grid-template-columns: 1fr;
    }
  }
</style>
