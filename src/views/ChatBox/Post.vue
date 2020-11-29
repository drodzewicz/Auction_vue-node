<template>
    <div class="post-container" :class="{author: this.isAuthor, animate}">
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
        animate: {
            type: Boolean,
            default: false
        },
        timeStamp: {
            type: Date
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
    padding: 0.4rem 0.6rem;
    margin: 0.3rem 0.4rem;
    border-radius: 12px;
    border-bottom-left-radius: 2px;
    align-self: flex-start;
    font-family: "Roboto", sans-serif;
    max-width: 40rem;

    &.animate {
        animation: message-pop 0.5s forwards 0.2s;
        transform: scale(0);

        @keyframes message-pop {
            from {
                transform: scale(0.2);
            }
            to {
                transform: scale(1.1);
            }
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
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 2px;
        .message {
            color: white;
        }
        .time-stamp {
            color: rgb(112, 116, 125);
        }
    }
}
</style>
