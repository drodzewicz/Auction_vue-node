const Auction = require("../../models/auction");

const auctionService = {};

auctionService.placeABid = async function (auctionId, bidPrice, bidAuthor) {
    try {
        const foundAuction = await Auction.findOne({ _id: auctionId });
        const startDate = new Date(foundAuction.startDate);
        const endDate = new Date(foundAuction.endDate);
        const timeNow = new Date();
        const { bids, price } = foundAuction;
        if (startDate <= timeNow && endDate >= timeNow) {
            if (bids.length === 0 && price >= bidPrice) {
                // check if it is a first bid and compare to initial price
                return { msg: `placed bid must be higher than ${price}` };
            } else if (bids.length !== 0 && (bids[bids.length - 1].price >= bidPrice)) {
                // if it is not first bid compare to highest bid
                return { msg: `placed bid must be higher than ${bids[bids.length - 1].price}` };
            }
            const author = {
                id: bidAuthor.id,
                username: bidAuthor.username
            };

            const newBid = {
                price: bidPrice,
                author,
                timeStamp: new Date()
            };
            foundAuction.buyer = author;
            let prevTopBidder;
            if (foundAuction.bids.length > 0) {
                prevTopBidder = foundAuction.bids[foundAuction.bids.length - 1].author.id;
            }
            foundAuction.bids.push(newBid);
            await foundAuction.save();
            return {
                newBid,
                prevTopBidder: author.id.toLocaleString() !== prevTopBidder.toLocaleString() ? prevTopBidder.toLocaleString() : undefined,
                auctionName: foundAuction.name
            };
        }
        return { msg: "auction is not active" };
    } catch (error) {
        return { msg: Auction.processErrors(error) };
    }
};

module.exports = auctionService;
