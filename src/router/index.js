import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import NewAuction from "../views/NewAuction.vue";
import AuctionShow from "../views/AuctionShow.vue";
import EditAuction from "../views/EditAuction.vue";
import Profile from "../views/Profile.vue";
import MyLiveAuctions from "../views/ProfileViews/MyLiveAuctions.vue";
import MyAuctions from "../views/ProfileViews/MyAuctions.vue";
import ParticipatedAuctions from "../views/ProfileViews/ParticipatedAuctions.vue";
import Purchased from "../views/ProfileViews/Purchased.vue";
import Chat from "../views/Chat.vue";
import ErrorPage from "../views/ErrorPage.vue";
import ChatBox from "../views/ChatBox.vue";

import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/new-auction",
        name: "NewAuction",
        component: NewAuction,
        beforeEnter: (to, from, next) => {
            if (store.state.user.user === null) {
                next("/login");
            } else {
                next();
            }
        }
    },
    {
        path: "/auction/:id",
        name: "AuctionShow",
        component: AuctionShow
    },
    {
        path: "/auction/:id/edit",
        name: "EditAuction",
        component: EditAuction
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
        beforeEnter: (to, from, next) => {
            if (store.state.user.user === null) {
                next("/login");
            } else {
                next();
            }
        },
        redirect: {
            name: "MyAuctions"
        },
        children: [
            {
                name: "LiveAuctions",
                path: "live-auctions",
                component: MyLiveAuctions
            },
            {
                name: "MyAuctions",
                path: "my-auctions",
                component: MyAuctions
            },
            {
                name: "Participated",
                path: "participated",
                component: ParticipatedAuctions
            },
            {
                name: "Purchased",
                path: "purchased",
                component: Purchased
            }
        ]
    },
    {
        path: "/chat",
        name: "Chat",
        component: Chat,
        children: [{
            path: ":id",
            component: ChatBox
        }],
        beforeEnter: (to, from, next) => {
            if (store.state.user.user === null) {
                next("/login");
            } else {
                next();
            }
        }
    },
    {
        path: "/error-notfound",
        name: "ErrorPage",
        component: ErrorPage
    },
    {
        path: "/*",
        redirect: {
            name: "ErrorPage"
        }
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
