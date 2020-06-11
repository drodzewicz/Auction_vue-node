const Auction = require("../models/auction");

const auctionMiddleware = {};

auctionMiddleware.validatePrice = function (req, res, next) {
    const { auction } = res;
    const { price } = req.body;

    // first check if placed bid is nor lower than initial price
    if (price === undefined || price <= auction.price) {
        return res.status(403).json({
            err: true,
            msg: { price: `bid must be higher that ${auction.price}` }
        });
    }

    // if there are bids in this auction then new bid must be higher than the current highest one
    if (auction.bids !== undefined && auction.bids.length > 0) {
        const currentHighestPrice = auction.bids[auction.bids.length - 1].price;
        if (currentHighestPrice >= price) {
            return res.status(403).json({
                err: true,
                msg: { price: `bid must be higher that ${currentHighestPrice}` }
            });
        }
    }
    next();
};

auctionMiddleware.checkIfAuctionHasEnded = function (_req, res, next) {
    const { auction } = res;

    const auctionEndDate = new Date(auction.endDate);
    const timeNow = new Date();
    if (auctionEndDate <= timeNow) {
        return res.status(403).json({
            err: true,
            msg: "auction has ended"
        });
    }
    next();
};

auctionMiddleware.checkIfAuctionHasStarted = function (_req, res, next) {
    const { startDate, endDate } = res.auction;
    if (startDate !== undefined && endDate !== undefined) {
        const givenStartDate = new Date(startDate);
        const timeNow = new Date();
        if (givenStartDate <= timeNow) {
            return res.status(403).json({
                msg: "you can not edit an auction that is in progress"
            });
        }
    }
    return next();
};

auctionMiddleware.checkIfAuctionHasNotStarted = function (_req, res, next) {
    const { startDate } = res.auction;
    if (startDate !== undefined) {
        const givenStartDate = new Date(startDate);
        const timeNow = new Date();
        if (givenStartDate > timeNow) {
            return res.status(403).json({
                msg: "auction has not started yet"
            });
        }
    }
    return next();
};

auctionMiddleware.dateValidation = function (req, res, next) {
    const { endDate, startDate } = req.body;
    if ((endDate !== undefined && startDate === undefined) || (startDate !== undefined && endDate === undefined)) {
        return res.status(400).json({
            msg: {
                endDate: "end date must be given",
                startDate: "start date must be given"
            }
        });
    }
    const givenEndDate = new Date(endDate);
    const givenStartDate = new Date(startDate);
    const today = new Date();
    if (givenEndDate < today) {
        return res.status(400).json({
            msg: { endDate: "date must occure in the future" }
        });
    } else if (givenStartDate < today) {
        return res.status(400).json({
            msg: { startDate: "date must occure in the future" }
        });
    } else if (givenStartDate >= givenEndDate) {
        return res.status(400).json({
            msg: {
                endDate: "end date must occur later than start date",
                startDate: "start date must occur before end date"
            }
        });
    }

    next();
};

auctionMiddleware.getAuction = async function (req, res, next) {
    const auctionId = req.params.id;
    let foundAuction;
    try {
        foundAuction = await Auction.findById(auctionId);
        if (foundAuction == null) {
            return res.status(404).json({
                err: true,
                message: `auction with id: ${auctionId} not found`
            });
        }
    } catch (error) {
        return res.status(500).json({
            err: true,
            message: error.message
        });
    }
    res.auction = foundAuction;
    next();
};

auctionMiddleware.canUserBuy = function (_req, res, next) {
    const { ednDate, startDate, buyer } = res.auction;
    if (ednDate === undefined || startDate === undefined || buyer === undefined) {
        return next();
    }
    return res.status(403).json({
        msg: "you can not buy this "
    });
};
auctionMiddleware.isUserAuthor = function (req, res, next) {
    const { author } = res.auction;
    if (author.username === req.user.username) {
        return next();
    }
    return res.status(403).json({
        msg: "you don't have permission to edit this aution"
    });
};

module.exports = auctionMiddleware;
