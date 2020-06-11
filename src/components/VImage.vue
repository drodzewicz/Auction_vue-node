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
        }
    },
    methods: {
        imageLoadError (e) {
            e.target.src = "/image_not_loaded.svg";
        }
    }
};
</script>
