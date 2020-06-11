<template>
    <div class="search-bar">
        <input placeholder="Search" type="text" @input="updateValue($event.target.value)" />
        <button @click="execSearch"><i class="fas fa-search"></i></button>
    </div>
</template>

<script>
export default {
    name: "SearchBard",
    methods: {
        updateValue (value) {
            this.$emit("input", value);
        },
        execSearch () {
            this.$emit("search");
        }
    }
};
</script>

<style lang="scss" >
.search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(187, 187, 187);
    margin: 0.5rem 1rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.319);
    transition: all 0.3s ease-in-out;
    input {
        font-family: "Roboto", sans-serif;
        margin: 0;
        font-size: 1.1rem;
        background: transparent;
        border: none;
        padding-left: 0.5rem;
        outline: none;
        flex-grow: 1;
    }
    button {
        margin: 0;
        background: $main-dark-blue;
        color: white;
        font-family: "Secular One", sans-serif;
        font-size: 1rem;
        border: none;
        padding: 0.2rem 0.4rem;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &:hover {
            background: rgb(71, 66, 206);
        }
    }
}
</style>
