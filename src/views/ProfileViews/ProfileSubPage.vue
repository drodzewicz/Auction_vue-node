<template>
  <div class="product-sub-page-container">
    <h2 class="section-title">{{this.title}}</h2>
    <slot name="before" />
    <slot v-if="!isLoading && !isEmpty" name="content" />
    <div v-if="isLoading" class="spinner-wrapper">
        <spinner-1 />
    </div>
    <h2 v-if="!isLoading && isEmpty" class="empty">{{emptyPlaceholder || "No products found"}}</h2>
    <slot v-if="!isLoading" name="pagination"/>
  </div>
</template>

<script>
import { Spinner1 } from "@/components/Spinners";

export default {
    name: "ProfileSubPage",
    components: {
        Spinner1
    },
    props: {
        title: String,
        isLoading: Boolean,
        isEmpty: Boolean,
        emptyPlaceholder: String
    }
};
</script>

<style lang="scss">
    .product-sub-page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        .empty {
            color: rgb(74, 74, 85);
        }

        .aucion-box{
            margin-top: 1.5rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 0.6rem;

            @include mobile {
                grid-template-columns: 1fr;
            }
        }
        .pagination-container {
            margin-top: 1rem;
        }
    }
</style>
