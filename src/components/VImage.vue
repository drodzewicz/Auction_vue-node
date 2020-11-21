<template>
    <img :class="classes" :src="imageUrl" @error="imageLoadError" />
</template>

<script>
export default {
    name: "VImage",
    props: {
        imageUrl: {
            type: String
        },
        classes: {
            type: String
        },
        defaultImage: {
            type: String,
            default: "/image_not_loaded.svg"
        }
    },
    methods: {
        imageLoadError (e) {
            e.target.src = this.defaultImage;
        }
    }
};
</script>
