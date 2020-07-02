"use strict";

const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../../middleware/user");

const {
    getLoggedInUserAuctions,
    getLoggedInUserPurchases,
    getLoggedInUserLiveAuctions,
    getLoggedInUserParticipatedAuctions
} = require("../../services/http/auction");

router.route("/my-auctions")
    .get(isLoggedIn, getLoggedInUserAuctions);

router.route("/participations")
    .get(isLoggedIn, getLoggedInUserParticipatedAuctions);

router.route("/purchased")
    .get(isLoggedIn, getLoggedInUserPurchases);

router.route("/live-auctions")
    .get(isLoggedIn, getLoggedInUserLiveAuctions);

module.exports = router;
