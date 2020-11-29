<template>
<div class="chat-header">
    <v-image :imageUrl="imageLink" defaultImage="/default_avatar_image.svg"  />
    <h2 class="chat-room-title">{{this.username}}</h2>
    <div class="status">
        <span class="dot" :class="{ online: isOnline}"></span>
        <span class="status-text">{{this.isOnline ? "Online" : "Offline"}}</span>
    </div>
</div>
</template>

<script>
import VImage from "@/components/VImage";

export default {
    name: "ChatHeader",
    components: {
        VImage
    },
    props: {
        isOnline: {
            type: Boolean
        },
        username: {
            type: String
        },
        imageLink: {
            type: String,
            default: ""
        }
    }
};
</script>

<style lang="scss">
    .chat-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        img {
            $avatar-size: 1.5rem;
            width: $avatar-size;
            height: $avatar-size;
            border-radius: 10rem;
            object-fit: cover;
            margin-right: 0.5rem;
        }
        .chat-room-title {
            flex-grow: 1;
            margin: 0;
        }
        .status {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            .dot {
                display: block;
                background: #E82F2F;
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 5rem;
                margin-right: 0.2rem;
                transform: translateY(-2px);

                &.online {
                    background: #54e640;
                }
            }
            .status-text {
                font-family: 'Roboto', sans-serif;
                color: rgb(78, 78, 78);
                font-size: 0.8rem;
                font-style: italic;
            }
        }

    }

</style>
