<template>
  <form class="chat-input">
        <input class="message" v-model="postContent" />
        <button
            type="submit"
            class="send-post-button"
            :class="{active: postContent.length > 0}"
            @click="sendMessage"
        >
            <i class="fas fa-paper-plane" />
        </button>
  </form>
</template>

<script>
export default {
    name: "ChatInput",
    data () {
        return {
            postContent: ""
        };
    },
    methods: {
        sendMessage (event) {
            event.preventDefault();
            this.$emit("post", this.postContent);
            this.postContent = "";
        }
    }
};
</script>

<style lang="scss">
    .chat-input {
        background: rgb(200, 200, 226);
        border-radius: 5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        min-height: 2.5rem;
        padding: 0.5rem 0.4rem;
        box-sizing: border-box;
        overflow: hidden;
        .message {
            flex-grow: 1;
            height: 100%;
            outline: none;
            background: transparent;
            border: none;
        }
        .send-post-button {
            outline: none;
            background: $main-dark-blue;
            height: 2rem;
            width: 2rem;
            border-radius: 5rem;
            color: white;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            margin-left: 0.2rem;
            transform: translateX(150%);
            &:hover {
                background: lighten($main-dark-blue, 13%);
                box-shadow: 0 0 3px 1px rgba(lighten($main-dark-blue, 13%), 0.5);
            }
            &.active {
                transform: translateX(0);
            }
        }
    }
</style>
