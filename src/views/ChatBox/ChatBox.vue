<template>
    <div class="container">
        <div class="section">
            <chat-header :username="user.username" :isOnline="userOnlineCount === 2" />
            <div ref="convo" class="scrollable-content chat-box-wrapper">
                <chat-conversation :posts="conversation" :newPosts="newMessages" :authorUsername="getUser()" />
            </div>
            <chat-input @post="sendAMessage" />
        </div>
</div>
</template>

<script>
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatConversation from "./ChatConversation";
import { mapGetters } from "vuex";
import { bus } from "@/main";
export default {
    name: "ChatBox",
    components: {
        ChatHeader,
        ChatInput,
        ChatConversation
    },
    data () {
        return {
            userOnlineCount: 0,
            user: {
                username: "",
                id: ""
            },
            chatId: "",
            spinner: true,
            conversation: [],
            newMessages: []
        };
    },
    watch: {
        $route (to) {
            this.leaveChatRoom();
            this.chatId = to.params.id;
            this.getChatRoomInfo();
        }

    },
    updated () {
        const scrollHeight = this.$refs.convo.scrollHeight;
        this.$refs.convo.scrollTop = scrollHeight;
    },
    created () {
        this.getChatRoomInfo();
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
            this.newMessages.push(data);
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
        sendAMessage (post) {
            if (post !== "") {
                this.$sock.emit("sendMsg", {
                    post: post,
                    recieved: this.userOnlineCount === 2,
                    roomId: this.chatId,
                    recipientId: this.user.id
                },
                err => {
                    bus.$emit("changeMessage", err, "error");
                });
            }
        }
    }
};
</script>

<style lang="scss">
.container {

  /* give the outermost container a predefined size */
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.section {
  margin: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  /* for Firefox */
  min-height: 0;
}

.chat-box-wrapper {
  padding: 0.4rem;
  box-sizing: border-box;
  border-radius: 5px;
  background: rgb(255, 255, 255);
  box-shadow: 0 -1px 3px 1px rgba(0, 0, 0, 0.329);
  margin: 1rem 0;
}

.scrollable-content {
  flex-grow: 1;
  overflow: auto;
  /* for Firefox */
  min-height: 0;
  &::-webkit-scrollbar {
    height: 0.5em;
    width: 10px;
    }
    &::-webkit-scrollbar-track {
        background: rgb(216, 217, 241);
        border-radius: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgb(166, 167, 185);
        border-radius: 10px;
    }
}

</style>
