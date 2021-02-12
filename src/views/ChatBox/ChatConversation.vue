<template>
  <section class="chat-conversation">
    <div class="post-wrapper" v-for="post in posts" :key="post._id">
        <span class="new-messages" v-if="oldenstNewMessage===post._id && post.author.username!==authorUsername">New Messages</span>
        <post
            :timeStamp="new Date(post.timeStamp)"
            :message="post.content"
            :isAuthor="post.author.username===authorUsername"
        />
    </div>
    <post
        v-for="post in newPosts"
        :key="post._id"
        :animate="true"
        :timeStamp="new Date(post.timeStamp)"
        :message="post.content"
        :isAuthor="post.author.username===authorUsername"
    />
  </section>
</template>

<script>
import Post from "./Post";
export default {
    components: {
        Post
    },
    name: "ChatConversation",
    props: {
        posts: {
            type: Array
        },
        newPosts: {
            type: Array
        },
        authorUsername: {
            type: String
        }
    },
    computed: {
        oldenstNewMessage () {
            const oldestPostId = this.posts.filter(({ recieved }) => recieved === false);
            return oldestPostId.length > 0 ? oldestPostId[0]._id : "";
        }
    }
};
</script>

<style lang="scss">
    .chat-conversation {
        display: flex;
        flex-direction: column;
        .post-wrapper {
            display: flex;
            flex-direction: column;
            .new-messages {
                align-self: center;
                text-align: center;
                border-bottom: 1px solid rgb(93, 128, 93);
                color: rgb(60, 133, 45);
                margin: 1rem 0;
                width: 100%;
                max-width: 80%;
            }
        }
    }
</style>
