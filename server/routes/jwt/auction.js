"use strict";
const express = require("express");
const router = express.Router();

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

const passport = require("passport");
require("../../configs/passport-jwt")(passport);

router.route("/")
    .get(getAuctions)
    .post(passport.authenticate("jwt", { session: false }), dateValidation, createNewAuction);

router.route("/:id")
    .get(getAuction, (_req, res) => {
        res.status(200).json(res.auction);
    })
    .put(passport.authenticate("jwt", { session: false }), getAuction, isUserAuthor, checkIfAuctionHasStarted, dateValidation, editAuction)
    .patch(passport.authenticate("jwt", { session: false }), getAuction, checkIfAuctionHasNotStarted, checkIfAuctionHasEnded, validatePrice, placeABid)
    .delete(passport.authenticate("jwt", { session: false }), getAuction, deleteAuction);

router.route("/:id/buy_now")
    .patch(passport.authenticate("jwt", { session: false }), getAuction, canUserBuy, buyNow);

module.exports = router;
