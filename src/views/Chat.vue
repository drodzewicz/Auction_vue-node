<template>
    <div class="chat-container">
        <div class="chat-wrap">
            <router-view />
        </div>
        <nav class="chat-rooms" :class="{hide: hideRooms}">
            <div class="nav-header">
                <span class="arrows" @click="toggleHideRooms">
                    <img src="@/assets/double-arrow.svg" alt="double arrow" srcset="">
                </span>
                <img class="msg-icon" src="@/assets/message-icon-blue.svg" alt="chat" srcset="">
                <p>Chat</p>
            </div>
            <div class="rooms-wrapper">
                <search-bar :input="searchQuery" v-model="searchQuery" v-on:search="searchUserByUsername" />
                <spinner-1 v-if="this.myChatRooms.spinner || this.searchedUsers.spinner" />
                <div class="room-list" v-if="searchedUsers.users.length === 0 && !this.myChatRooms.spinner && !this.searchedUsers.spinner" >
                    <div
                        @click="gotToChat(room.id)"
                        class="room"
                        v-for="room in lsitOfContacts"
                        :key="room.id"
                    >
                        <VImage imageUrl="" defaultImage="/default_avatar_image.svg"  />
                        <span v-if="room.unreadMessages" class="dot"></span>
                        <span class="username">{{room.username}}</span>
                    </div>
                </div>
                <div class="searched-users" v-if="searchedUsers.users.length > 0 && !this.searchedUsers.spinner" >
                    <p class="search-results-tag">Search results for: <strong>{{this.searchQuery}}</strong></p>
                    <button class="clear-btn" @click="clearSearchResults">clear</button>
                    <div class="room-list">
                        <div
                            class="room"
                            v-for="(user, index) in searchedUsers.users"
                            :key="user.id"
                            @click="createChatRoom(user.username, index)"
                        >
                            <VImage imageUrl="" defaultImage="/default_avatar_image.svg"  />
                            <span class="username">{{user.username}}</span>
                            <span class="msg"><i class="fas fa-paper-plane" /></span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { SearchBar } from "@/components/Inputs";
import { mapGetters } from "vuex";
import { Spinner1 } from "../components/Spinners";
import { bus } from "../main";
import VImage from "@/components/VImage";

export default {
    name: "Chat",
    components: {
        SearchBar,
        Spinner1,
        VImage
    },
    data () {
        return {
            hideRooms: false,
            searchQuery: "",
            myChatRooms: { spinner: false, rooms: [] },
            searchedUsers: { spinner: false, users: [] }
        };
    },
    created () {
        this.getMyChatRooms();
        bus.$on("markUnreadMessage", (roomId) => {
            this.myChatRooms.rooms = this.myChatRooms.rooms.map(room => room._id === roomId ? ({ ...room, unreadMessages: true }) : room);
        });
    },
    methods: {
        ...mapGetters(["getUser"]),
        toggleHideRooms () {
            this.hideRooms = !this.hideRooms;
        },
        gotToChat (roomId) {
            this.myChatRooms.rooms = this.myChatRooms.rooms.map(room => room._id === roomId ? ({ ...room, unreadMessages: false }) : room);
            // this.toggleHideRooms();
            this.$router.push(`/chat/${roomId}`).catch(() => {});
        },
        async getMyChatRooms () {
            this.myChatRooms.spinner = true;
            try {
                const mychatRoomsFetched = await this.$http.get("/api/chat/my-chat");
                const unreadChatRooms = await this.$http.get("/api/chat/unread-messages");
                this.myChatRooms.spinner = false;
                this.myChatRooms.rooms = mychatRoomsFetched.data.chatRooms.map(room => {
                    if (unreadChatRooms.data.chatRooms.find(unreadRoom => unreadRoom._id === room._id)) {
                        return ({ ...room, unreadMessages: true });
                    }
                    return ({ ...room, unreadMessages: false });
                });
            } catch (error) {
                this.myChatRooms.spinner = false;
            }
        },
        async searchUserByUsername () {
            this.searchedUsers.spinner = true;
            try {
                const response = await this.$http.get(`/api/chat/users?username=${this.searchQuery}`);
                let tempList = response.data.users.filter(user => user.username !== this.getUser());
                tempList = tempList.filter(user => !this.lsitOfContacts.find(room => room.username === user.username));
                this.searchedUsers.spinner = false;
                this.searchedUsers.users = tempList.map(user => ({ id: user._id, username: user.username }));
            } catch (error) {
                bus.$emit("changeMessage", error.response.msg, "error");
                this.searchedUsers.spinner = false;
            }
        },
        clearSearchResults () {
            this.searchQuery = "";
            this.searchedUsers.users = [];
        },
        async createChatRoom (username, index) {
            try {
                const response = await this.$http.post(`/api/chat/${username}`);
                const room = response.data.chatRoom;
                this.myChatRooms.rooms.push(room);
                this.searchedUsers.users.splice(index, 1);
                this.clearSearchResults();
            } catch (error) {
                bus.$emit("changeMessage", error.response.msg, "error");
            }
        }
    },
    computed: {
        lsitOfContacts () {
            return this.myChatRooms.rooms.map(room => {
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
.chat-container {
    display: flex;
    flex-direction: row;
    position: absolute;
    width: 100%;
    height: 100%;
     .chat-wrap {
         flex-grow: 1;
         margin: 1rem;
         display: flex;
         justify-content: center;
         align-items: center;
         position: relative;
    }
    .chat-rooms {
        width: 15rem;
        background: #e0e1e4;
        transition: all 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        @include mobile {
            position: absolute;
            width: 100%;
            height: 100%;
            right: 0;
        }
        &.hide {
            margin-right: -15rem;
            @include mobile {
                margin-right: 0;
                transform: translateX(100%);
            }
            .arrows img {
                transform: rotate(180deg)
            }
            .nav-header {
                transform: translateX(-8.5rem);
                border-bottom-left-radius: 10px;
                overflow: hidden;
             }
        }
        .nav-header {
            transition: all 0.3s ease-in-out;
            background: #D0D5EF;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 1rem;
            height: 3rem;
            .msg-icon {
                margin: 0 0.5rem;
                height: 1.2rem;
                width: 1.2rem;
            }
            p {
                color: $main-dark-blue;
                margin: 0;
                font-size: 1.2rem;
            }

            .arrows {
                background: #A7AED1;
                width: 3rem;
                height: 3rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                img {
                    transition: transform 0.3s ease-in-out;
                }
            }
        }
        .rooms-wrapper {
            margin: 0.2rem 0.6rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
              .search-bar {
                    width: auto;
                    box-shadow: none;
                    border-radius: 5px;
                    margin-bottom: 1rem;
                    input {
                        font-size: 0.6rem;
                        margin: 0.1rem 0.2rem;
                    }
                    button {
                        font-size: 0.9rem;
                    }
                }
                .room-list {
                    max-height: 100vh;
                    overflow-y: scroll;
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
                        border-radius: 5px;
                    }
                }
                    .room {
                        margin: 1px 0;
                        background: #cfcfda;
                        border-radius: 3px;
                        padding: 0.2rem 0.4rem;
                        display: flex;
                        align-items: center;
                        transition: all 0.3s ease-in-out;
                        cursor: pointer;
                        &:hover {
                            background:#bdbdd3;
                            .msg {
                                box-shadow: 0 0 3px 1px rgba(lighten($main-dark-blue, 15%), 0.5);
                                background: lighten($main-dark-blue, 15%);
                            }
                        }
                        img {
                            height: 1.2rem;
                            width: 1.2rem;
                            border-radius: 10rem;
                            object-fit: cover;
                            margin-right: 0.3rem;
                        }
                        .dot {
                            background: #E82F2F;
                            width: 0.5rem;
                            height: 0.5rem;
                            display: block;
                            border-radius: 10rem;
                            position: absolute;
                            transform: translate(0.8rem, -0.5rem);
                        }
                        .msg {
                            background: $main-dark-blue;
                            color: white;
                            padding: 0.3rem 0.4rem;
                            font-size: 0.6rem;
                            border-radius: 3px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: auto;
                            margin-right: 0;
                            transition: all 0.3s ease-in-out;
                        }
                    }
                .searched-users {
                    display: flex;
                    flex-direction: column;
                    .search-results-tag {
                        font-family: 'Roboto', sans-serif;
                        color: rgb(63, 63, 77);
                        font-size: 0.8rem;
                        strong {
                            color: black;
                            font-size: 1rem;
                        }
                    }
                    .clear-btn {
                        border: none;
                        font-family: 'Secular One', sans-serif;
                        background: transparent;
                        color: $main-dark-blue;
                        align-self: center;
                        text-decoration: underline;
                        cursor: pointer;
                        outline: none;
                    }
                }
        }
    }
}

</style>
