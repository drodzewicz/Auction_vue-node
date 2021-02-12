<template>
    <form class="search-bar">
        <input :value="input" placeholder="Search" type="text" @input="updateValue($event.target.value)" />
        <button type="submit" @click="execSearch"><i class="fas fa-search"></i></button>
    </form>
</template>

<script>
export default {
    name: "SearchBard",
    props: {
        input: {
            type: String
        }
    },
    methods: {
        updateValue (value) {
            this.$emit("input", value);
        },
        execSearch (event) {
            event.preventDefault();
            this.$emit("search");
        }
    }
};
</script>

<style lang="scss" >
.search-bar {
    display: flex;
    background: rgb(187, 187, 187);
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.319);
    transition: all 0.3s ease-in-out;
    align-items: stretch;
    width: 100%;
    input {
        font-family: "Roboto", sans-serif;
        margin: 0.5rem 0.6rem;
        font-size: 1.3rem;
        background: transparent;
        border: none;
        padding-left: 0.5rem;
        outline: none;
        flex-grow: 1;
    }
    button {
        margin: 0;
        background: $main-yellow;
        color: $main-dark-blue;
        font-family: "Secular One", sans-serif;
        font-size: 1.5rem;
        border: none;
        padding: 0.2rem 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        outline: none;
        &:hover {
             background: lighten($main-yellow, 10%)
        }
    }
}
</style>
