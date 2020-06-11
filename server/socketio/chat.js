
const { createPost } = require("../services/websocket/chat");

module.exports = (io, socket) => {
    //  messenger
    socket.on("subscribe", function (data) {
        socket.join(data.room);
        io.in(data.room).clients((_error, clients) => {
            io.in(data.room).emit("roomInfo", clients.length);
        });
    });

    // user room
    socket.on("joinUserRoom", function (data) {
        socket.join(data.userId);
    });

    socket.on("sendMsg", async (messageData, errorCal) => {
        const newMessage = await createPost(messageData.roomId, socket.request.user, messageData.recieved, messageData.post);
        if (newMessage.msg !== undefined) {
            errorCal(newMessage.msg);
        } else {
            io.in(messageData.roomId).emit("sendInfo", newMessage);

            io.in(messageData.roomId).clients((_error, clients) => {
                if (clients.length !== 2) {
                    socket.to(messageData.recipientId).emit("chatUserInfo", {
                        newMessage: socket.request.user.username,
                        roomId: messageData.roomId
                    });
                }
            });
        }
    });

    socket.on("unsubscribe", function (data) {
        socket.leave(data.room);
        io.in(data.room).clients((_error, clients) => {
            io.in(data.room).emit("roomInfo", clients.length);
        });
    });
};
