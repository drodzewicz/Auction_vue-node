const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [
        {
            user: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                username: String
            }
        }
    ],
    messages: [
        {
            content: "",
            timeStamp: {
                type: Date,
                default: Date.now()
            },
            recieved: {
                type: Boolean,
                default: true
            },
            author: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                username: String
            }
        }
    ]
});

const Chat = mongoose.model("Chat", chatSchema);

Chat.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Chat;
