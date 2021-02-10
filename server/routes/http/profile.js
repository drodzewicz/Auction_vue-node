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

const { changeAvatarImage } = require("../../services/http/user");

router.route("/my-auctions")
    .get(isLoggedIn, getLoggedInUserAuctions);

router.route("/participations")
    .get(isLoggedIn, getLoggedInUserParticipatedAuctions);

router.route("/purchased")
    .get(isLoggedIn, getLoggedInUserPurchases);

router.route("/live-auctions")
    .get(isLoggedIn, getLoggedInUserLiveAuctions);

router.route("/changeAvatar").put(isLoggedIn, changeAvatarImage);

module.exports = router;
