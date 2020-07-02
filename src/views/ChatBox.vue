<template>
    <div v-if="!spinner" class="chat-box-container">
        <div class="chat-box">
            <h2 class="chat-room-title">
                <span class="username">{{this.user.username}}</span>
                <span class="dot" :class="{ online: this.userOnlineCount == 2 }"></span>
            </h2>
            <div class="conversation-box">
                <div v-if="conversation!==[]" class="conversation-section">
                    <post
                        v-for="msg in conversation"
                        :key="msg._id"
                        :username="msg.author.username"
                        :timeStamp="new Date(msg.timeStamp)"
                        :recieved="msg.recieved"
                        :message="msg.content"
                        :isAuthor="msg.author.username===getUser()"
                    />
                </div>
            </div>
            <div class="post-input">
                <area-text :value="post" name="message" :displayLabel="false" v-model="post" />
                <button class="blue-btn" @click="sendAMessage">send <i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
import { AreaText } from "@/components/Inputs";
import Post from "@/components/Post.vue";
import { mapGetters } from "vuex";
import { bus } from "../main";
export default {
    name: "ChatBox",
    components: {
        AreaText,
        Post
    },
    data () {
        return {
            post: "",
            userOnlineCount: 0,
            user: {
                username: "",
                id: ""
            },
            chatId: "",
            spinner: true,
            conversation: []
        };
    },
    watch: {
        $route (to) {
            this.leaveChatRoom();
            this.chatId = to.params.id;
            this.getChatRoomInfo();
        }
    },
    created () {
        this.getChatRoomInfo();
    },
    updated () {
        this.scrollToEnd();
    },
    destroyed () {
        this.leaveChatRoom();
    },
    methods: {
        ...mapGetters(["getUser"]),
        async getChatRoomInfo () {
            try {
                const response = await this.$http.get(`/api/chat/${this.$route.params.id}`);
                this.spinner = false;
                this.user = response.data.chatRoom.participants
                    .filter(user => user.user.username !== this.getUser())
                    .map(user => ({ username: user.user.username, id: user.user.id }))[0];
                this.chatId = response.data.chatRoom._id;
                this.conversation = response.data.chatRoom.messages;

                this.recieveUnreadMessages();
                this.joinChatRoom();
            } catch (error) {
                this.spinner = false;
                bus.$emit("changeMessage", "failed to load chat", "error");
            }
        },
        getUserCountInRoom (data) {
            this.userOnlineCount = data;
        },
        getMessage (data) {
            this.conversation.push(data);
        },
        leaveChatRoom () {
            this.$sock.emit("unsubscribe", { room: this.chatId, user: this.getUser() });
            this.$sock.removeListener("roomInfo", this.getUserCountInRoom);
            this.$sock.removeListener("sendInfo", this.getMessage);
        },
        joinChatRoom () {
            this.$sock.emit("subscribe", { room: this.chatId });

            this.$sock.on("roomInfo", this.getUserCountInRoom);
            this.$sock.on("sendInfo", this.getMessage);
        },
        async recieveUnreadMessages () {
            try {
                await this.$http.patch(`/api/chat/${this.chatId}/recieve`);
            } catch (error) {}
        },
        sendAMessage () {
            if (this.post !== "") {
                this.$sock.emit("sendMsg", {
                    post: this.post,
                    recieved: this.userOnlineCount === 2,
                    roomId: this.chatId,
                    recipientId: this.user.id
                },
                err => {
                    bus.$emit("changeMessage", err, "error", "lox");
                });
                this.post = "";
            }
        },
        scrollToEnd () {
            const container = document.querySelector(".conversation-section");
            const scrollHeight = container.scrollHeight;
            container.scrollTop = scrollHeight;
        }
    }
};
</script>

<style lang="scss">
.chat-box-container{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.chat-box {
    width: 100%;
    max-width: 150rem;

    .chat-room-title {
        color: $main-dark-blue;
        display: flex;
        flex-direction: row;
        align-items: center;
        .dot{
            background: gray;
            display: block;
            width: 1rem;
            height: 1rem;
            margin-left: 1rem;
            border-radius: 10rem;
            &.online {
                background: green;
                box-shadow: 0 0 4px 2px rgb(184, 255, 184);
            }
        }
    }
    .conversation-box {
        background: white;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.381);
        border-radius: 10px;
        height: 60vh;
        width: 100%;
        .conversation-section {
            width: calc(100% - 0.5rem);
            padding: 0 0.5rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;

            align-items: flex-start;
        }
    }
    .post-input {
        display: flex;
        flex-direction: column;
        .text-area textarea {
            margin-top: 1rem;
            height: 10rem;
        }
        .blue-btn {
            align-self: center;
            .fas {
              margin-left: 0.3rem;
              font-size: 1rem;
            }
        }
    }
}
</style>
