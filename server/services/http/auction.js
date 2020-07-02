const Auction = require("../../models/auction");
const { paginateConetnt } = require("../../_helper");

const auctionService = {};

auctionService.getAuctions = async function (req, res) {
    let { finished, page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const timeNow = new Date();
    let searchQuery = {};

    // query parameter for searching auctions that have ended or ongoing
    if (finished !== undefined && finished.toUpperCase() === "TRUE") {
        searchQuery = { $or: [{ endDate: { $not: { $gte: timeNow } }, buyer: { $exists: true } }, { endDate: { $lt: timeNow } }] };
    } else if (finished !== undefined && finished.toUpperCase() === "FALSE") {
        searchQuery = { $or: [{ endDate: { $not: { $lte: timeNow } }, buyer: { $exists: false } }, { endDate: { $gt: timeNow } }] };
    }

    // pagination
    if (!isNaN(page) && !isNaN(limit)) {
        const paginatedAuctions = await paginateConetnt(Auction, page, limit, searchQuery);
        return res.json({
            auctions: paginatedAuctions
        });
    } else {
        try {
            const allAuctions = await Auction.find(searchQuery);
            return res.status(200).json({
                auctions: { items: allAuctions },
                keke: true
            });
        } catch (error) {
            return res.status(400).json({
                msg: Auction.processErrors(error)
            });
        }
    }
};

auctionService.getLoggedInUserAuctions = async function (req, res) {
    const { page, limit, purchased } = req.query;
    let searchQuery = { "author.username": req.user.username };

    if (purchased !== undefined && purchased.toUpperCase() === "TRUE") {
        searchQuery = { "buyer.username": req.user.username };
    };

    if (page !== undefined && limit !== undefined) {
        const paginatedAuctions = await paginateConetnt(Auction, page, limit, searchQuery);
        return res.json({
            auctions: paginatedAuctions
        });
    } else {
        try {
            const allAuctions = await Auction.find(searchQuery);
            return res.status(200).json({
                auctions: allAuctions
            });
        } catch (error) {
            return res.status(400).json({
                msg: Auction.processErrors(error)
            });
        }
    }
};

auctionService.getLoggedInUserParticipatedAuctions = async function (req, res) {
    const { page, limit } = req.query;
    const searchQuery = { bids: { $elemMatch: { "author.username": req.user.username } } };

    if (page !== undefined && limit !== undefined) {
        const paginatedAuctions = await paginateConetnt(Auction, page, limit, searchQuery);
        return res.json({
            auctions: paginatedAuctions
        });
    } else {
        try {
            const allAuctions = await Auction.find(searchQuery);
            return res.status(200).json({
                auctions: allAuctions
            });
        } catch (error) {
            return res.status(400).json({
                msg: Auction.processErrors(error)
            });
        }
    }
};

auctionService.getLoggedInUserLiveAuctions = async function (req, res) {
    const timeNow = new Date();
    const searchQuery = { startDate: { $lt: timeNow }, endDate: { $gt: timeNow }, bids: { $elemMatch: { "author.username": req.user.username } } };
    try {
        const allAuctions = await Auction.find(searchQuery);
        return res.status(200).json({
            auctions: allAuctions
        });
    } catch (error) {
        return res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

auctionService.getLoggedInUserPurchases = async function (req, res) {
    const { page, limit } = req.query;
    const timeNow = new Date();
    const searchQuery = { "buyer.username": req.user.username, endDate: { $not: { $gt: timeNow } } };

    if (page !== undefined && limit !== undefined) {
        const paginatedAuctions = await paginateConetnt(Auction, page, limit, searchQuery);
        return res.json({
            auctions: paginatedAuctions
        });
    } else {
        try {
            const allAuctions = await Auction.find(searchQuery);
            return res.status(200).json({
                auctions: allAuctions
            });
        } catch (error) {
            return res.status(400).json({
                msg: Auction.processErrors(error)
            });
        }
    }
};

auctionService.createNewAuction = async function (req, res) {
    const newAuction = new Auction({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        price: req.body.price,
        timePosted: new Date(),
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        image: req.body.image,
        author: {
            id: req.user.id,
            username: req.user.username
        }
    });

    try {
        const addedAuction = await newAuction.save();
        return res.status(201).json({
            auction: addedAuction
        });
    } catch (error) {
        return res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

auctionService.editAuction = async function (req, res) {
    const { auction } = res;

    auction.name = req.body.name;
    auction.description = req.body.description;
    auction.tags = req.body.tags;
    auction.price = req.body.price;
    auction.startDate = req.body.startDate;
    auction.endDate = req.body.endDate;
    auction.image = req.body.image;

    try {
        const updatedAuction = await auction.save();
        res.status(200).json({
            auction: updatedAuction
        });
    } catch (error) {
        res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

auctionService.placeABid = async function (req, res) {
    const { auction } = res;
    const { user } = req;
    const { price } = req.body;

    const author = {
        id: user.id,
        username: user.username
    };
    const newBid = {
        price,
        author,
        timeStamp: new Date()
    };
    auction.buyer = author;
    try {
        auction.bids.push(newBid);
        auction.save();
        res.status(200).json({
            bid: newBid
        });
    } catch (error) {
        res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

auctionService.buyNow = async function (req, res) {
    const { auction } = res;

    try {
        auction.buyer = {
            id: req.user.id,
            username: req.user.username
        };
        auction.save();
        res.status(200).json({
            username: req.user.username,
            msg: "successfully bought item"
        });
    } catch (error) {
        res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

auctionService.deleteAuction = async function (_req, res) {
    const { auction } = res;
    try {
        await auction.remove();
        res.status(200).json({
            msg: `successfully deleted auction id: ${auction.id}`
        });
    } catch (error) {
        res.status(400).json({
            msg: Auction.processErrors(error)
        });
    }
};

module.exports = auctionService;
