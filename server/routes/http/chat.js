const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../../middleware/user");
const {
    createARoom,
    getMyChatRooms,
    createPost,
    getUsersByQuery,
    readUnrecievedMessages,
    getMyChatRoomsWithUndreadMessages
} = require("../../services/http/chat");
const {
    checkIfChatRoomExists,
    checkIfUserExists,
    getRoom
} = require("../../middleware/chat");

router.route("/:username")
    .post(isLoggedIn, checkIfUserExists, checkIfChatRoomExists, createARoom);

router.route("/my-chat")
    .get(isLoggedIn, getMyChatRooms);

router.route("/unread-messages")
    .get(isLoggedIn, getMyChatRoomsWithUndreadMessages);

router.route("/users")
    .get(getUsersByQuery);

router.route("/:id")
    .get(isLoggedIn, getRoom, (_req, res) => {
        res.status(200).json({
            chatRoom: res.foundRoom
        });
    })
    .patch(isLoggedIn, getRoom, createPost);

router.route("/:id/recieve")
    .patch(isLoggedIn, getRoom, readUnrecievedMessages);

module.exports = router;
