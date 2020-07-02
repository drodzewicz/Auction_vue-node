"use strict";

const express = require("express");
const router = express.Router();

const passport = require("passport");
require("../../configs/passport-jwt")(passport);

const {
    getLoggedInUserAuctions,
    getLoggedInUserPurchases,
    getLoggedInUserLiveAuctions,
    getLoggedInUserParticipatedAuctions
} = require("../../services/http/auction");

router.route("/my-auctions")
    .get(passport.authenticate("jwt", { session: false }), getLoggedInUserAuctions);

router.route("/participations")
    .get(passport.authenticate("jwt", { session: false }), getLoggedInUserParticipatedAuctions);

router.route("/purchased")
    .get(passport.authenticate("jwt", { session: false }), getLoggedInUserPurchases);

router.route("/live-auctions")
    .get(passport.authenticate("jwt", { session: false }), getLoggedInUserLiveAuctions);

module.exports = router;
