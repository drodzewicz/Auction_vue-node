import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import NewAuction from "@/views/AuctionEditor/NewAuction.vue";
import AuctionShow from "@/views/AuctionShow/AuctionShow.vue";
import EditAuction from "@/views/AuctionEditor/EditAuction.vue";
import ProfilePages from "@/views/ProfileViews/ProfilePages.vue";
import { MyAuctions, MyLiveAuctions, Participations, Purchased, Profile } from "@/views/ProfileViews";

import Chat from "@/views/Chat.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import ChatBox from "@/views/ChatBox/ChatBox.vue";
import Auctions from "@/views/Auctions.vue";

import store from "../store";

const notAuthenticatedUserHandler = (to, from, next) => {
    if (store.getters.GET_USER.username) {
        next();
    } else {
        store.watch(() => store.getters.GET_USER.username, () => {
            if (store.getters.GET_USER.username !== null) {
                next();
            } else {
                next("/login");
            }
        });
    }
};
const changeTitle = (to, from, next) => {
    const { title } = to.meta;
    document.title = typeof title === "function" ? title(to.params.id) : title;
    next();
};

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { title: "bidit | Home" }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { title: "bidit | Login" }
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: { title: "bidit | Register" }
    },
    {
        path: "/new-auction",
        name: "NewAuction",
        component: NewAuction,
        meta: { title: "bidit | Create New Auction" },
        beforeEnter: notAuthenticatedUserHandler
    },
    {
        path: "/auction",
        name: "Auctions",
        component: Auctions,
        meta: { title: "bidit | auctions" }
    },
    {
        path: "/auction/:id",
        name: "AuctionShow",
        component: AuctionShow,
        meta: { title: id => `bidit | auction ${id}` }
    },
    {
        path: "/auction/:id/edit",
        name: "EditAuction",
        component: EditAuction,
        meta: { title: "bidit | Edit" }
    },
    {
        path: "/profile",
        component: ProfilePages,
        meta: { title: "bidit | Profile" },
        beforeEnter: notAuthenticatedUserHandler,
        children: [
            {
                name: "Details",
                path: "/",
                component: Profile,
                meta: { title: "bidit | Profile" }
            },
            {
                name: "LiveAuctions",
                path: "live-auctions",
                component: MyLiveAuctions,
                meta: { title: "bidit | Profile - live auctions" }
            },
            {
                name: "MyAuctions",
                path: "my-auctions",
                component: MyAuctions,
                meta: { title: "bidit | Profile - my auctions" }
            },
            {
                name: "Participated",
                path: "participated",
                component: Participations,
                meta: { title: "bidit | Profile - participated auctions" }
            },
            {
                name: "Purchased",
                path: "purchased",
                component: Purchased,
                meta: { title: "bidit | Profile - purchased" }
            }
        ]
    },
    {
        path: "/chat",
        name: "Chat",
        component: Chat,
        meta: { title: "bidit | Chat" },
        children: [{
            path: ":id",
            component: ChatBox,
            meta: { title: id => `bidit | Chat ${id}` }
        }],
        beforeEnter: notAuthenticatedUserHandler
    },
    {
        path: "/error-notfound",
        name: "ErrorPage",
        component: ErrorPage,
        meta: { title: "bidit | Error" }
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

router.beforeEach(changeTitle);

export default router;
