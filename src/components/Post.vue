<template>
    <div class="post-container" :class="{author: this.isAuthor, newMsg: !this.recieved && !this.isAuthor}">
        <strong class="username">{{this.username}}</strong>
        <p class="message">{{this.message}}</p>
        <span class="time-stamp">{{momentTime}}</span>
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "Post",
    props: {
        message: {
            type: String
        },
        recieved: {
            type: Boolean
        },
        timeStamp: {
            type: Date
        },
        username: {
            type: String
        },
        isAuthor: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        momentTime () {
            return moment(this.timeStamp).fromNow();
        }
    }
};
</script>

<style lang="scss">
.post-container {
    background: rgb(224, 224, 224);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0.2rem 0.4rem;
    margin: 0.3rem 0.4rem;
    border-radius: 10px;
    align-self: flex-start;
    font-family: "Roboto", sans-serif;
    .username {
        font-size: 0.7rem;

        &::after {
            content: ":";
        }
    }
    .message {
        margin: 0;
        font-size: 0.9rem;
    }
    .time-stamp {
        color: grey;
        font-size: 0.6rem;
    }

    &.author {
        align-self: flex-end;
        background: $main-dark-blue;
        .username,
        .message {
            color: white;
        }
        .time-stamp {
            color: rgb(112, 116, 125);
        }
    }
    &.newMsg {
        box-shadow: 0 0 3px 2px rgba(0, 128, 0, 0.653);
    }
}
</style>
