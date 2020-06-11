const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    name: {
        type: String,
        required: [true, "field is required"],
        minlength: [3, "must not be less that 4 charatcters"]
    },
    description: {
        type: String,
        default: ""
    },
    tags: {
        type: [String, "must be a string"],
        index: true,
        default: []
    },
    image: {
        type: String,
        index: true,
        default: ""
    },
    price: {
        type: Number,
        required: [true, "field is required"],
        min: [0, "value must not be less than 0"]
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    buyer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    bids: [
        {
            price: Number,
            timeStamp: {
                type: Date,
                default: Date.now
            },
            author: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                username: String
            }
        }
    ]
});

const Auction = mongoose.model("Auction", auctionSchema);

Auction.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Auction;
