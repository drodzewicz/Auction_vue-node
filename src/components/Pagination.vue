<template>
    <div class="pagination-container">
        <div class="next-item">
          <div class="btn-container" :class="{show: prev}">
              <button @click="prevPage" class="pgination-btn"><i class="fas fa-angle-left"></i></button>
          </div>
          <span @click="prevPage" v-if="prev" class="item">{{this.currentPage - 1}}</span>
        </div>
        <span v-if="prev || next" class="item selected">{{this.currentPage}}</span>
        <div class="next-item">
          <span @click="nextPage" v-if="next" class="item">{{this.currentPage + 1}}</span>
          <div class="btn-container" :class="{show: next}">
              <button @click="nextPage" class="pgination-btn"><i class="fas fa-angle-right"></i></button>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    model: {
        prop: "currentPage",
        event: "click"
    },
    props: {
        prev: null,
        next: null,
        currentPage: null
    },
    methods: {
        nextPage () {
            this.$emit("click", this.currentPage + 1);
        },
        prevPage () {
            this.$emit("click", this.currentPage - 1);
        }
    }
};
</script>

<style lang="scss">
.pagination-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;

    .next-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 5rem;
    }

    .item {
        padding: 0.5rem;
        border-radius: 10rem;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.421);
        width: 0.5rem;
        height: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "Secular One", sans-serif;
        font-size: 0.8rem;
        margin: 0.5rem;
        outline: none;
        background: rgb(213, 213, 213);
        color: $main-dark-blue;
        cursor: pointer;

        &.selected {
          font-size: 1rem;
          width: 0.8rem;
          height: 0.8rem;
          background: $main-dark-blue;
          color: white;
          cursor: auto;
        }
    }
    .pgination-btn {
        cursor: pointer;
        font-family: "Secular One", sans-serif;
        color: $main-dark-blue;
        border: none;
        border: none;
        outline: none;
        font-size: 1.1rem;
        background: transparent;
        display: none;
    }
    .btn-container {
        width: 2rem;
        &.show {
            .pgination-btn {
                display: flex;
            }
        }
    }
}
</style>
