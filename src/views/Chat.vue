<template>
    <div class="chat-container">
        <button class="toggle-btn-hide" @click="toggleHideRooms"><i class="fas fa-bars"></i></button>
        <div class="chat-rooms" :class="{hide: hideRooms}">
            <button class="toggle-btn-hide" @click="toggleHideRooms"><i class="fas fa-times"></i></button>
            <search-bar v-model="searchQuery" v-on:search="searchUserByUsername" />
            <div v-if="searchedUsers.length === 0" class="my-rooms">
                <div
                    @click="gotToChat(room.id)"
                    class="room"
                    v-for="room in lsitOfContacts"
                    :key="room.id"
                >
                <span class="username">{{room.username}}</span>
                <span v-if="room.unreadMessages" class="dot"></span></div>
            </div>
            <div v-if="searchedUsers.length > 0" class="searched-users">
                <button class="clear-btn" @click="clearSearchResults">clear</button>
                <div
                    class="room"
                    v-for="user in searchedUsers"
                    :key="user.id"
                    @click="createChatRoom(user.username)"
                >
                    {{user.username}}
                </div>
            </div>
        </div>
        <div class="chat-wrap">
            <router-view />
        </div>
    </div>
</template>

<script>
import { SearchBar } from "@/components/Inputs";
import { mapGetters } from "vuex";
import { bus } from "../main";

export default {
    name: "Chat",
    components: {
        SearchBar
    },
    data () {
        return {
            hideRooms: false,
            searchQuery: "",
            myChatRooms: [],
            searchedUsers: []
        };
    },
    created () {
        this.getMyChatRooms();
        bus.$on("markUnreadMessage", (roomId) => {
            this.myChatRooms = this.myChatRooms.map(room => room._id === roomId ? ({ ...room, unreadMessages: true }) : room);
        });
    },
    methods: {
        ...mapGetters(["getUser"]),
        toggleHideRooms () {
            this.hideRooms = !this.hideRooms;
        },
        gotToChat (roomId) {
            this.myChatRooms = this.myChatRooms.map(room => room._id === roomId ? ({ ...room, unreadMessages: false }) : room);
            this.$router.push(`/chat/${roomId}`).catch(() => {});
        },
        async getMyChatRooms () {
            try {
                const mychatRooms = await this.$http.get("/api/chat/my-chat");
                const unreadChatRooms = await this.$http.get("/api/chat/unread-messages");
                this.myChatRooms = mychatRooms.data.chatRooms.map(room => {
                    if (unreadChatRooms.data.chatRooms.find(unreadRoom => unreadRoom._id === room._id)) {
                        return ({ ...room, unreadMessages: true });
                    }
                    return ({ ...room, unreadMessages: false });
                });
            } catch (error) {
                console.log(error.response);
            }
        },
        async searchUserByUsername () {
            try {
                const response = await this.$http.get(`/api/chat/users?username=${this.searchQuery}`);
                let tempList = response.data.users.filter(user => user.username !== this.getUser());
                tempList = tempList.filter(user => !this.lsitOfContacts.find(room => room.username === user.username));
                this.searchedUsers = tempList.map(user => ({ id: user._id, username: user.username }));
            } catch (error) {
                console.log(error.response);
            }
        },
        clearSearchResults () {
            this.searchedUsers = [];
        },
        async createChatRoom (username) {
            try {
                const response = await this.$http.post(`/api/chat/${username}`);
                const room = response.data.chatRoom;
                this.myChatRooms.push(room);
            } catch (error) {
                console.log(error.response);
            }
        }
    },
    computed: {
        lsitOfContacts () {
            return this.myChatRooms.map(room => {
                return {
                    id: room._id,
                    username: room.participants
                        .filter(user => user.user.username !== this.getUser())
                        .map(user => user.user.username)[0],
                    unreadMessages: room.unreadMessages
                };
            });
        }
    }
};
</script>

<style lang="scss">
$side-bar-width: 14rem;
.chat-container {
    position: relative;

    .chat-wrap {
        margin-right: $side-bar-width + 1rem;
        @include mobile {
            margin-right: 0;
        }
    }
      .toggle-btn-hide {
        margin-top: 1rem;
        border: none;
        font-weight: bold;
        align-self: flex-start;
        background: transparent;
        cursor: pointer;
        outline: none;
        display: none;
        @include mobile {
            display: block;
        }
    }
}
.chat-rooms {
    background: white;
    box-shadow: -1px 0 1px 1px rgba(0, 0, 0, 0.5);
    right: 0;
    top: 4.5rem;
    width: $side-bar-width;
    height: calc(100vh - 4.5rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    padding: 1rem 0.2rem;
    overflow: scroll;
    transition: 0.3s all ease-in-out;
    z-index: 3;
    @include mobile {
        width: 100%;
    }
    .toggle-btn-hide {
      margin-left: 1rem;
    }

    &.hide {
        width: $side-bar-width;
        @include mobile {
            width: 0;
        }
    }

    .clear-btn {
        border: none;
        background: rgb(221, 221, 221);
        border-radius: 4px;
        padding: 0.1rem 0.2rem;
        cursor: pointer;
        font-weight: bold;
        margin-left: 0.3rem;
    }
    .my-rooms, .searched-users{
        width: 100%;
    }

    .search-bar {
        box-shadow: none;
        border-radius: 5px;
        input {
            width: 6.5rem;
            font-size: 0.6rem;
        }
        button {
            font-size: 0.7rem;
        }
    }
    .room {
        background: white;
        width: auto;
        padding: 0.2rem 0.4rem;
        margin-bottom: 1px;
        width: 100%;
        height: 1.5rem;
        box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-size: 0.85rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        @include mobile {
          padding: 0.2rem 1rem;
        }
        &:hover {
            background: rgb(231, 231, 231);
        }
        .dot {
            background: rgb(216, 68, 68);
            width: 0.5rem;
            height: 0.5rem;
            display: block;
            border-radius: 10rem;
            margin-left: 1rem;
        }
    }
}
</style>
