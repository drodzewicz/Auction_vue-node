const Chat = require("../../models/chat");
const User = require("../../models/user");

const chatService = {};

chatService.createARoom = async function (req, res) {
    const { foundUser, user } = req;
    const newChatRoom = new Chat({
        participants: [user.id, foundUser.id]
    });
    try {
        const savedChatRoom = await newChatRoom.save();
        return res.status(200).json({
            savedChatRoom
        });
    } catch (error) {
        return res.status(400).json({
            msg: Chat.processErrors(error)
        });
    }
};

chatService.getMyChatRooms = async function (req, res) {
    try {
        const foundChatRooms = await Chat.find({
            participants: req.user.id
        }).populate("participants");
        res.status(200).json({
            chatRooms: foundChatRooms
        });
    } catch (error) {
        return res.status(400).json({
            msg: Chat.processErrors(error)
        });
    }
};
chatService.getMyChatRoomsWithUndreadMessages = async function (req, res) {
    try {
        const foundChatRooms = await Chat.find({
            participants: req.user.id,
            messages: {
                $elemMatch: {
                    recieved: false,
                    "author.username": { $ne: req.user.user }
                }
            }
        }, "_id");
        res.status(200).json({
            chatRooms: foundChatRooms
        });
    } catch (error) {
        return res.status(400).json({
            msg: Chat.processErrors(error)
        });
    }
};

chatService.readUnrecievedMessages = async function (req, res) {
    const { foundRoom } = res;
    const { user } = req;

    foundRoom.messages.forEach(message => {
        if ((message.author.username !== user.username) && (message.recieved === false)) {
            message.recieved = true;
        }
    });

    try {
        await foundRoom.save();
        return res.status(200).json({ msg: `user ${user.username} recieved all unread messages` });
    } catch (error) {
        return res.status(400).json({
            msg: Chat.processErrors(error)
        });
    }
};

chatService.getUsersByQuery = async function (req, res) {
    const { username } = req.query;
    let searchQuery = {};
    if (username !== undefined || username !== "") {
        searchQuery = { username: { $regex: username, $options: "i" } };
    }
    try {
        const foundUsers = await User.find(searchQuery);
        return res.status(200).json({
            users: foundUsers
        });
    } catch (error) {
        return res.status(400).json({
            msg: User.processErrors(error)
        });
    }
};

module.exports = chatService;
