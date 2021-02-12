const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    name: {
        type: String,
        required: [true, "field is required"],
        minlength: [5, "must not be less that 5 charatcters"]
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
    timePosted: {
        type: Date
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
