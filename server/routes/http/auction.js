"use strict";

const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../../middleware/user");
const {
    getAuction,
    canUserBuy,
    isUserAuthor,
    dateValidation,
    validatePrice,
    checkIfAuctionHasEnded,
    checkIfAuctionHasStarted,
    checkIfAuctionHasNotStarted
} = require("../../middleware/auction");
const {
    buyNow,
    placeABid,
    getAuctions,
    editAuction,
    deleteAuction,
    createNewAuction
} = require("../../services/http/auction");

router.route("/")
    .get(getAuctions)
    .post(isLoggedIn, dateValidation, createNewAuction);

router.route("/:id")
    .get(getAuction, (_req, res) => {
        res.status(200).json(res.auction);
    })
    .put(isLoggedIn, getAuction, isUserAuthor, checkIfAuctionHasStarted, dateValidation, editAuction)
    .patch(isLoggedIn, getAuction, checkIfAuctionHasNotStarted, checkIfAuctionHasEnded, validatePrice, placeABid)
    .delete(isLoggedIn, getAuction, deleteAuction);

router.route("/:id/buy")
    .patch(isLoggedIn, getAuction, canUserBuy, buyNow);

module.exports = router;
