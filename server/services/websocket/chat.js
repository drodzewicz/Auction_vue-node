const Chat = require("../../models/chat");

const chatService = {};

chatService.createPost = async function (chatRoomId, author, recieved, message) {
    try {
        const foundChatRoom = await Chat.findOne({ _id: chatRoomId });
        const newMessage = {
            author: {
                id: author.id,
                username: author.username
            },
            content: message,
            recieved: recieved,
            timeStamp: new Date()
        };
        foundChatRoom.messages.push(newMessage);
        await foundChatRoom.save();
        return newMessage;
    } catch (error) {
        return { msg: Chat.processErrors(error) };
    }
};

module.exports = chatService;
